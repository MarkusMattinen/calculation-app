import { BehaviorSubject } from 'rxjs';
import { ControlValue, ControlValueState } from './ControlValue';
import { CalculationDataSource, CalculationFn, ControlValueCalculation, IsEditableFn } from './CalculationDataSource';
import {
  AnyControlValue,
  ControlValueKey,
  ControlValueKeyOfType,
  ControlValueLocks,
  ControlValues,
  defaultControlValues,
  wrapNullValues
} from './ControlValues';
import { cloneDeep, isEqual, isFunction, mapKeys, mapValues, pickBy } from 'lodash-es';
import { LockDataSource } from './LockDataSource';

const DEBUG = true;
const MAX_ROUNDS = 10;

/**
 * Main control value store
 */
export class ControlValueStore {
  public controlValues: ControlValues = wrapNullValues(defaultControlValues);
  public controlValues$: BehaviorSubject<ControlValues> = new BehaviorSubject<ControlValues>(this.controlValues);
  private locks: ControlValueLocks = mapKeys(
    mapValues(this.controlValues, (value) => value.editable),
    (k) => `${k}Locked`
  ) as ControlValueLocks;
  private calculationFns: Partial<Record<ControlValueKey, CalculationFn>> = {};
  private isEditableFns: Partial<Record<ControlValueKey, IsEditableFn>> = {};

  /**
   * Apply partial updates to store
   */
  private applyChanges(updates: Partial<ControlValues>): { changes: boolean, lockChanges: boolean } {
    let changes = false;
    let lockChanges = false;
    // Apply changes
    for (const key of Object.keys(updates)) {
      if (!updates[key]) {
        continue;
      }

      if (updates[key].hasOwnProperty('value') && updates[key].value !== this.controlValues[key].value) {
        this.controlValues[key].value = updates[key].value;
        changes = true;

        if (DEBUG) {
          console.log('update', key, '=', updates[key].value);
        }
      }

      if (updates[key].hasOwnProperty('state') && updates[key].state !== this.controlValues[key].state) {
        this.controlValues[key].state = updates[key].state;
        changes = true;
      }

      if (updates[key].hasOwnProperty('errors') && !isEqual(updates[key].errors, this.controlValues[key].errors)) {
        this.controlValues[key].errors = updates[key].errors;
        changes = true;

        if (DEBUG) {
          console.log('errors', key, JSON.stringify(updates[key].errors));
        }
      }

      if (updates[key].hasOwnProperty('locked') && updates[key].locked !== this.controlValues[key].locked) {
        this.controlValues[key].locked = updates[key].locked;
        this.locks[`${key}Locked`] = updates[key].locked;
        changes = true;
        lockChanges = true;
      }

      if (updates[key].hasOwnProperty('editable') && updates[key].editable !== this.controlValues[key].editable) {
        this.controlValues[key].editable = updates[key].editable;
        changes = true;
      }
    }

    return { changes, lockChanges };
  }

  /**
   * Apply partial updates to store and calculate.
   * Recursively calls itself until the calculation round results in no changes, or MAX_ROUNDS is reached.
   */
  private applyChangesAndCalculate(updates: Partial<ControlValues>, skippedCalculations: ControlValueKey[], round: number = 0): void {
    const { changes, lockChanges } = this.applyChanges(updates);

    // Only run calculations if something changed
    if (changes && round < MAX_ROUNDS) {
      if (DEBUG) {
        console.log('starting calculation round', round);
      }

      // Clone control values so that calculations cannot modify them directly, and to make comparing to previous values easier
      const controlValues = cloneDeep(this.controlValues);
      // Run all calculations once, and collect the results
      const calculationResults: Partial<ControlValues> = pickBy(
        mapValues(this.calculationFns, (value, key: ControlValueKey) =>
          skippedCalculations.includes(key)
            ? null
            : this.calculationFns[key](controlValues)
        ),
        (value) => value?.state === ControlValueState.CALCULATED || value?.state === ControlValueState.FAILED
      );

      // Apply results to store and start next calculation round
      return this.applyChangesAndCalculate(calculationResults, skippedCalculations, round + 1);
    } else if (changes && round === MAX_ROUNDS) {
      console.error('Warning: Maximum calculation rounds exceeded after applying changes', updates);
    }

    // Only update editable state if locks changed
    if (lockChanges) {
      // Calculate editable states
      const isEditableResults: Partial<ControlValues> = mapValues(this.isEditableFns, (value, key: ControlValueKey) => ({
        editable: this.isEditableFns[key](this.locks)
      }));

      // Apply editable states to store
      this.applyChanges(isEditableResults);
    }

    // Update the subject after calculations have finished
    this.controlValues$.next(this.controlValues);
  }

  /**
   * Set initial control values
   */
  public init(initialControlValues?: Partial<ControlValues>) {
    if (initialControlValues) {
      // Add INITIAL state to initial control values
      for (const key of Object.keys(initialControlValues)) {
        const controlValue: AnyControlValue = initialControlValues[key];

        if (controlValue) {
          controlValue.state = ControlValueState.INITIAL;
        }
      }

      this.applyChanges(wrapNullValues(initialControlValues));
      this.controlValues$.next(this.controlValues);
    }
  }

  /**
   * Connect a calculation to the store
   */
  public addCalculation<T>(key: ControlValueKey, calculation: ControlValueCalculation<T>): void {
    const dataSource = new CalculationDataSource(key)
      .onlyWhenNotLocked(); // Never calculate locked values

    this.calculationFns[key] = calculation.calculate(dataSource);

    if (isFunction(calculation.isEditable)) {
      const lockDataSource = new LockDataSource(key);
      this.isEditableFns[key] = calculation.isEditable(lockDataSource);
    }
  }

  /**
   * Update one or more control values in the store, and mark them as explicitly set
   */
  public patch(updates: Partial<ControlValues>) {
    const changedKeys: ControlValueKey[] = Object.keys(updates) as ControlValueKey[];
    // Add EXPLICITLY_SET state to all updated control values and clear errors
    for (const key of changedKeys) {
      updates[key].state = ControlValueState.EXPLICITLY_SET;
      updates[key].errors = [];
    }

    this.applyChangesAndCalculate(updates, changedKeys);
  }

  /**
   * Update a control value in the store, and mark it as explicitly set
   */
  public set<V, K extends ControlValueKeyOfType<V>>(key: K, controlValue: ControlValue<V>): void {
    const updates = {
      [key]: {
        ...controlValue,
        state: ControlValueState.EXPLICITLY_SET,
        errors: []
      }
    };

    this.applyChangesAndCalculate(updates, [key]);
  }

  /**
   * Update the value of a control value in the store, and mark it as explicitly set
   */
  public setValue<V, K extends ControlValueKeyOfType<V>>(key: K, value: V): void {
    const updates = {
      [key]: {
        value,
        state: ControlValueState.EXPLICITLY_SET,
        errors: []
      }
    };

    this.applyChangesAndCalculate(updates, [key]);
  }

  /**
   * Update the locked state of a control value in the store
   */
  public setLocked<V, K extends ControlValueKeyOfType<V>>(key: K, locked: boolean): void {
    const updates = {
      [key]: {
        locked
      }
    };

    this.applyChangesAndCalculate(updates, [key]);
  }
}
