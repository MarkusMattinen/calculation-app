import { ControlValueCalculation, ValidationFn } from '../CalculationDataSource';
import { ValidationDataSource } from '../ValidationDataSource';

export class UnitPrice implements ControlValueCalculation<number> {
  validate(dataSource: ValidationDataSource): ValidationFn {
    return dataSource
      .mustBePositive()
      .validate();
  }
}
