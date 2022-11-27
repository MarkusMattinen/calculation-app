import { Observable } from 'rxjs';
import { ControlValue } from './ControlValue';
import { ControlValueKey, ControlValueKeyOfType, ControlValues } from './ControlValues';

/**
 * Main public entrypoint to the control value store and calculations.
 */
export interface IControlValueCalculator {
  /**
   * Set initial control values
   */
  init(initialControlValues: Partial<ControlValues>);

  /**
   * Get the whole control value store state
   */
  getAll(): ControlValues;

  /**
   * Get an observable of the whole control value store state
   */
  getAll$(): Observable<ControlValues>;

  /**
   * Get a single control value
   */
  get<K extends ControlValueKey>(key: K): ControlValues[K];

  /**
   * Get an observable of a single control value
   */
  get$<K extends ControlValueKey>(key: K): Observable<ControlValues[K]>;

  /**
   * Get the value of a single control value
   */
  getValue<K extends ControlValueKey>(key: K): ControlValues[K]['value'];

  /**
   * Get an observable of the value of a single control value
   */
  getValue$<K extends ControlValueKey>(key: K): Observable<ControlValues[K]['value']>;

  /**
   * Get an observable of the editable state of a single control value
   */
  isEditable<K extends ControlValueKey>(key: K): boolean;

  /**
   * Get an observable of the editable state of a single control value
   */
  isEditable$<K extends ControlValueKey>(key: K): Observable<boolean>;

  /**
   * Set multiple control values
   */
  patch(controlValues: Partial<ControlValues>): void;

  /**
   * Set a single control value
   */
  set<V, K extends ControlValueKeyOfType<V>>(key: K, controlValue: ControlValue<V>): void;

  /**
   * Set the value of a single control value
   */
  setValue<V, K extends ControlValueKeyOfType<V>>(key: K, value: V): void;

  /**
   * Set the locked state of a single control value
   */
  setLocked<V, K extends ControlValueKeyOfType<V>>(key: K, locked: boolean): void;
}
