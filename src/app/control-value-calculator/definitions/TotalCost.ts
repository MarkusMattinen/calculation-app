import { CalculationDataSource, CalculationFn, ControlValueCalculation, ValidationFn } from '../CalculationDataSource';
import { ValidationDataSource } from '../ValidationDataSource';

export class TotalCost implements ControlValueCalculation<number> {
  calculate(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValuesDistinct('labourCost', 'warehousingCost')
      .validatePositiveOrZeroValue('labourCost', 'warehousingCost')
      .calculate(({ labourCost, warehousingCost }) =>
        labourCost.value + warehousingCost.value
      );
  }

  validate(dataSource: ValidationDataSource): ValidationFn {
    return dataSource
      .mustBePositiveOrZero()
      .validate();
  }
}
