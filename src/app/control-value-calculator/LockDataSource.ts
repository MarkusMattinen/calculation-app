import { ControlValueKey, ControlValueLocks } from './ControlValues';
import { IsEditableFn } from './CalculationDataSource';

/**
 * Data source for control value locks for a single control value
 */
export class LockDataSource {
  key: ControlValueKey;
  isEditableFns: IsEditableFn[];

  constructor(key: ControlValueKey, isEditableFns: IsEditableFn[] = []) {
    this.key = key;
    this.isEditableFns = isEditableFns;
  }

  /**
   * Only calculate editable states when one of the specified keys has changed
   */
  useLocks(...keys: ControlValueKey[]) {
    const lockKeys = keys.map((key) => `${key}Locked`);
    let previousLocks: ControlValueLocks;
    const distinctFn: IsEditableFn = (locks: ControlValueLocks) => {
      if (!previousLocks) {
        // First values -> continue calculation
        previousLocks = locks;
        return true;
      }

      for (const lockKey of lockKeys) {
        if (previousLocks[lockKey] !== locks[lockKey]) {
          // Change detected -> continue calculation
          previousLocks = locks;
          return true;
        }
      }

      // No change detected -> skip calculation
      previousLocks = locks;
      return null;
    };


    return new LockDataSource(this.key, [...this.isEditableFns, distinctFn]);
  }

  /**
   * Unwrap the configuration into a single calculation function
   */
  editableWhen(editableFn: (locks: ControlValueLocks) => boolean): IsEditableFn {
    return (locks: ControlValueLocks) => {
      for (const partialEditableFn of this.isEditableFns) {
        const partialResult = partialEditableFn(locks);

        if (partialResult == null) {
          return null;
        }
      }

      return editableFn(locks);
    };
  }
}
