import { CalculationDataSource, CalculationFn, ControlValueCalculation, ValidationFn } from '../CalculationDataSource';
import { ValidationDataSource } from '../ValidationDataSource';

export class MaximumStockValue implements ControlValueCalculation<number> {
  calculate(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValuesDistinct('maximumStockQuantity', 'unitPrice')
      .validatePositiveValue('maximumStockQuantity', 'unitPrice')
      .calculate(({ maximumStockQuantity, unitPrice }) =>
        maximumStockQuantity.value * unitPrice.value
      );
  }

  validate(dataSource: ValidationDataSource): ValidationFn {
    return dataSource
      .mustBePositive()
      .validate();
  }
}
