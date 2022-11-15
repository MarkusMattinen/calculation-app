import { isEqual, isEmpty, union } from 'lodash-es';
import {
  AnyControlValue,
  AnyControlValueValue,
  ControlValueKey,
  ControlValueLocks,
  ControlValues
} from './ControlValues';
import { ControlValueError, ControlValueState } from './ControlValue';
import { LockDataSource } from './LockDataSource';
import { ValidationDataSource } from './ValidationDataSource';

export type CalculationFn = (controlValues: ControlValues) => AnyControlValue;
export type FilterControlValueFn = (controlValues: ControlValues) => boolean;
export type IsEditableFn = (locks: ControlValueLocks) => boolean;
export type ValidationFn = (value: AnyControlValueValue, controlValues: ControlValues) => ControlValueError | null;
export type ResultValidationFn = (result: AnyControlValueValue) => ControlValueError | null;
export type PartialCalculationFn = (result: AnyControlValue, controlValues: ControlValues) => AnyControlValue;

/**
 * Interface to implement for calculations
 */
export interface ControlValueCalculation<T> {
  calculate?(dataSource: CalculationDataSource): CalculationFn;
  validate?(dataSource: ValidationDataSource): ValidationFn;
  isEditable?(dataSource: LockDataSource): IsEditableFn;
}

/**
 * Data source for a single control value, with helper methods for receiving calculation inputs
 * from the data source and returning calculation results.
 */
export class CalculationDataSource {
  key: ControlValueKey;
  preCalculationFns: PartialCalculationFn[];

  constructor(key: ControlValueKey, preCalculationFns: PartialCalculationFn[] = []) {
    this.key = key;
    this.preCalculationFns = preCalculationFns;
  }

  /**
   * Only calculate when one of the specified keys has changed
   */
  distinct(...keys: ControlValueKey[]): CalculationDataSource {
    let previousControlValues: ControlValues;
    const distinctFn: PartialCalculationFn = (result: AnyControlValue, controlValues: ControlValues) => {
      if (!previousControlValues) {
        // First values -> continue calculation
        previousControlValues = controlValues;
        return null;
      }

      for (const key of keys) {
        if (previousControlValues[key].value !== controlValues[key].value
        || previousControlValues[key].locked !== controlValues[key].locked
        || previousControlValues[key].state !== controlValues[key].state
        || !isEqual(previousControlValues[key].errors, controlValues[key].errors)) {
          // Change detected -> continue calculation
          previousControlValues = controlValues;
          return null;
        }
      }

      // No change detected -> skip calculation
      previousControlValues = controlValues;
      return { state: ControlValueState.UNCHANGED };
    };

    return new CalculationDataSource(this.key, [...this.preCalculationFns, distinctFn]);
  }

  /**
   * Apply a projection to the control value being calculated
   */
  mapResult(mapFn: PartialCalculationFn): CalculationDataSource {
    return new CalculationDataSource(this.key, [...this.preCalculationFns, mapFn]);
  }

  /**
   * If any of the specified keys has failed to calculate, add error
   */
  validateNotFailed(...keys: ControlValueKey[]): CalculationDataSource {
    return this.mapResult((result: AnyControlValue, controlValues: ControlValues) => {
      let errors = result.errors || {};

      keys.forEach((key: ControlValueKey) => {
        const otherControlValue: AnyControlValue = controlValues[key];
        if (!isEmpty(otherControlValue.errors)) {
          errors = { ...errors, ...otherControlValue.errors };
        }
      });

      if (!isEmpty(errors)) {
        return {
          state: ControlValueState.FAILED,
          errors
        };
      }

      return null;
    });
  }

  /**
   * If any of the specified keys has a null value, add error
   */
  validateNotNull(...keys: ControlValueKey[]): CalculationDataSource {
    return this.mapResult((result: AnyControlValue, controlValues: ControlValues) => {
      let errors = result.errors || {};

      keys.forEach((key: ControlValueKey) => {
        const otherControlValue: AnyControlValue = controlValues[key];
        if (otherControlValue.value == null) {
          if (errors.valueIsNull) {
            errors.valueIsNull = union(errors.valueIsNull, [key]);
          } else {
            errors = { ...errors, valueIsNull: [key] };
          }
        }
      });

      if (!isEmpty(errors)) {
        return {
          state: ControlValueState.FAILED,
          errors
        };
      }

      return null;
    });
  }

  /**
   * If any of the specified keys does not have a positive numeric value, add error
   */
  validatePositiveValue(...keys: ControlValueKey[]): CalculationDataSource {
    return this.mapResult((result: AnyControlValue, controlValues: ControlValues) => {
      let errors = result.errors || {};

      keys.forEach((key: ControlValueKey) => {
        const otherControlValue: AnyControlValue = controlValues[key];
        if (!(otherControlValue.value > 0) && otherControlValue.value != null) {
          if (errors.valueIsNotPositive) {
            errors.valueIsNotPositive = union(errors.valueIsNotPositive, [key]);
          } else {
            errors = { ...errors, valueIsNotPositive: [key] };
          }
        }
      });

      if (!isEmpty(errors)) {
        return {
          state: ControlValueState.FAILED,
          errors
        };
      }

      return null;
    });
  }

  /**
   * If any of the specified keys does not have a positive numeric value or 0, add error
   */
   validatePositiveOrZeroValue(...keys: ControlValueKey[]): CalculationDataSource {
    return this.mapResult((result: AnyControlValue, controlValues: ControlValues) => {
      let errors = result.errors || {};

      keys.forEach((key: ControlValueKey) => {
        const otherControlValue: AnyControlValue = controlValues[key];
        if (!(otherControlValue.value >= 0) && otherControlValue.value != null) {
          if (errors.valueIsNotPositiveOrZero) {
            errors.valueIsNotPositiveOrZero = union(errors.valueIsNotPositiveOrZero, [key]);
          } else {
            errors = { ...errors, valueIsNotPositiveOrZero: [key] };
          }
        }
      });

      if (!isEmpty(errors)) {
        return {
          state: ControlValueState.FAILED,
          errors
        };
      }

      return null;
    });
  }

  /**
   * Helper for applying distinct check and null/failed checks to specified control values
   * NOTE: This should always be applied first!
   */
  useValuesDistinct(...keys: ControlValueKey[]): CalculationDataSource {
    return this
      .distinct(...keys)
      .onlyWhenAllNotNull(...keys)
      .validateNotFailed(...keys);
  }


  /**
   * Helper for applying null/failed checks to specified control values
   * NOTE: This should always be applied first!
   */
   useValues(...keys: ControlValueKey[]): CalculationDataSource {
    return this
      .onlyWhenAllNotNull(...keys)
      .validateNotFailed(...keys);
  }

  /**
   * Skips calculation when the predicate returns false.
   */
  onlyWhen(predicateFn: FilterControlValueFn): CalculationDataSource {
    return this.mapResult((result: AnyControlValue, controlValues: ControlValues) => {
      if (!predicateFn(controlValues)) {
        return { state: ControlValueState.SKIPPED };
      }

      return null;
    });
  }

  /**
   * Only calculate when all of the specified keys have non-null values or an error.
   * Use this instead of validateNotNull if errors are not desired
   */
  onlyWhenAllNotNull(...keys: ControlValueKey[]): CalculationDataSource {
    return this.onlyWhen((controlValues: ControlValues) =>
      keys.every((key: ControlValueKey) => controlValues[key].value != null || !isEmpty(controlValues[key].errors))
    );
  }

  /**
   * Only calculate when any of the specified keys has EXPLICITLY_SET state.
   */
  onlyWhenAnyExplicitlySet(...keys: ControlValueKey[]): CalculationDataSource {
    return this.onlyWhen((controlValues: ControlValues) =>
      keys.some((key: ControlValueKey) => controlValues[key].state === ControlValueState.EXPLICITLY_SET)
    );
  }

  /**
   * Only calculate when all of the specified keys have EXPLICITLY_SET state.
   */
  onlyWhenAllExplicitlySet(...keys: ControlValueKey[]): CalculationDataSource {
    return this.onlyWhen((controlValues: ControlValues) =>
      keys.every((key: ControlValueKey) => controlValues[key].state === ControlValueState.EXPLICITLY_SET)
    );
  }

  /**
   * Only calculate when any of the specified keys has EXPLICITLY_SET state, or the control value being calculated has null value.
   */
  onlyWhenNullOrAnyExplicitlySet(...keys: ControlValueKey[]): CalculationDataSource {
    return this.onlyWhen((controlValues: ControlValues) =>
      keys.some((key: ControlValueKey) => controlValues[key].state === ControlValueState.EXPLICITLY_SET
        || (controlValues[this.key].value == null && controlValues[key].state === ControlValueState.INITIAL))
    );
  }

  /**
   * Only calculate when all of the specified keys have EXPLICITLY_SET state, or the control value being calculated has null value.
   */
  onlyWhenNullOrAllExplicitlySet(...keys: ControlValueKey[]): CalculationDataSource {
    return this.onlyWhen((controlValues: ControlValues) =>
      keys.every((key: ControlValueKey) => controlValues[key].state === ControlValueState.EXPLICITLY_SET
        || (controlValues[this.key].value == null && controlValues[key].state === ControlValueState.INITIAL))
    );
  }

  /**
   * Only calculate when the control value being calculated is not locked.
   * Used internally before all calculations.
   */
  onlyWhenNotLocked(): CalculationDataSource {
    return this.onlyWhen((controlValues: ControlValues) =>
      !controlValues[this.key].locked
    );
  }

  /**
   * Only calculate when all of the specified keys are locked
   */
  onlyWhenAllLocked(...keys: ControlValueKey[]): CalculationDataSource {
    return this.onlyWhen((controlValues: ControlValues) =>
      keys.every((key: ControlValueKey) => controlValues[key].locked === true)
    );
  }

  /**
   * Unwrap the calculation configuration into a single calculation function.
   * calculate
   */
  calculate<T extends AnyControlValueValue>(calculationFn: (controlValues: ControlValues) => T): CalculationFn {
    return (controlValues: ControlValues) => {
      let preCalculationResult: AnyControlValue = {};

      for (const partialCalculationFn of this.preCalculationFns) {
        const partialResult = partialCalculationFn(preCalculationResult, controlValues);
        if (partialResult) {
          preCalculationResult = {
            ...preCalculationResult,
            ...partialResult
          };
        }

        // Stop calculation immediately on SKIPPED or UNCHANGED state
        if (preCalculationResult?.state === ControlValueState.SKIPPED
        || preCalculationResult?.state === ControlValueState.UNCHANGED) {
          return preCalculationResult;
        }
      }

      // Stop calculation right before actual calculation on FAILED state (to get all the errors)
      if (!isEmpty(preCalculationResult.errors)) {
        return preCalculationResult;
      }

      const calculationResult: T = calculationFn(controlValues);

      return {
        state: ControlValueState.CALCULATED,
        value: calculationResult,
        errors: null
      };
    };
  }

  /**
   * Helper to try multiple calculation methods and return the first valid result.
   * Results with unchanged state are treated as skipped. This means that when input values of one of
   * the calculation methods change, that result will be returned (bypassing the specified order).
   */
  merge(...calculationMethods: CalculationFn[]): CalculationFn {
    return (controlValues: ControlValues) => {
      const results = calculationMethods.map((calculationMethod) =>
        calculationMethod(controlValues)
      );

      return this.mapCombinedResults(results);
    };
  }

  /**
   * Helper to try multiple calculation methods and return the first valid result.
   * If a calculation method returns unchanged state, its previous result is returned again.
   * This means that the provided order of calculation methods always determines which result is returned
   * (changes to the input values of a calculation method do not affect the order)
   */
  tryInOrder(...calculationMethods: CalculationFn[]): CalculationFn {
    const previousResults = [];
    return (controlValues: ControlValues) => {
      const results = calculationMethods.map((calculationMethod, index) => {
        const calculationResult = calculationMethod(controlValues);

        // If calculation returns unchanged state, return the previous result again
        if (calculationResult.state === ControlValueState.UNCHANGED) {
          return previousResults[index];
        }

        previousResults[index] = calculationResult;
        return calculationResult;
      });

      return this.mapCombinedResults(results);
    };
  }

  private mapCombinedResults(results: AnyControlValue[]) {
    const firstValidResult = results.find((result) => result?.state === ControlValueState.CALCULATED);
    const failedResults = results.filter((result) => !isEmpty(result?.errors));
    const skippedResults = results.filter((result) =>
      result?.state === ControlValueState.SKIPPED || result?.state === ControlValueState.UNCHANGED);
    const allErrors = results.reduce((acc, result) => result?.errors ? { ...acc, ...result.errors } : acc, {});

    if (firstValidResult) {
      return firstValidResult;
    }

    if (failedResults.length > 0) {
      return {
        state: ControlValueState.FAILED,
        errors: allErrors
      };
    }

    if (skippedResults.length > 0) {
      return {
        state: ControlValueState.SKIPPED
      };
    }

    return null;
  }

  /**
   * Debug helper
   */
  tap(callback: (controlValue: AnyControlValue, controlValues: ControlValues) => any) {
    const callbackFn: PartialCalculationFn = (controlValue: AnyControlValue, controlValues: ControlValues) => {
      callback(controlValue, controlValues);
      return null;
    };

    return new CalculationDataSource(this.key, [...this.preCalculationFns, callbackFn]);
  }
}
