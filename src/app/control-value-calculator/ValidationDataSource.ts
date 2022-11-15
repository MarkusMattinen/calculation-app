import { isEmpty } from 'lodash-es';
import { AnyControlValueValue, ControlValueKey, ControlValues } from './ControlValues';
import { ValidationFn } from './CalculationDataSource';
import { ControlValueError } from './ControlValue';

/**
 * Data source for validation for a single control value
 */
export class ValidationDataSource {
  key: ControlValueKey;
  validationFns: ValidationFn[];

  constructor(key: ControlValueKey, validationFns: ValidationFn[] = []) {
    this.key = key;
    this.validationFns = validationFns;
  }

  /**
   * Add a new validation function to the configuration
   */
  addValidation(validationFn: ValidationFn): ValidationDataSource {
    return new ValidationDataSource(this.key, [...this.validationFns, validationFn]);
  }

  /**
   * Validate result > 0
   */
  mustBePositive(): ValidationDataSource {
    return this.addValidation((result) => {
      if (result > 0) {
        return null;
      }

      return { mustBePositive: `${result}` };
    });
  }

    /**
   * Validate result >= 0
   */
    mustBePositiveOrZero(): ValidationDataSource {
    return this.addValidation((result) => {
      if (result >= 0) {
        return null;
      }

      return { mustBePositiveOrZero: `${result}` };
    });
  }

  /**
   * Unwrap the configuration into a single calculation function
   */
  validate(validationFn?: ValidationFn): ValidationFn {
    return (value: AnyControlValueValue, controlValues: ControlValues) => {
      let validationResult: ControlValueError = {};

      for (const validationFn of this.validationFns) {
        const errors = validationFn(value, controlValues);
        if (errors) {
          validationResult = {
            ...validationResult,
            ...errors,
          };
        }
      }

      return !isEmpty(validationResult) ? validationResult : null;
    };
  }
}
