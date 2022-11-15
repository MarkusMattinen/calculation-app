import { CalculationDataSource, CalculationFn, ControlValueCalculation, ValidationFn } from '../CalculationDataSource';
import { ValidationDataSource } from '../ValidationDataSource';

export class SafetyStockValue implements ControlValueCalculation<number> {
  calculate(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValuesDistinct('safetyStockQuantity', 'unitPrice')
      .validatePositiveValue('unitPrice')
      .validatePositiveOrZeroValue('safetyStockQuantity')
      .calculate(({ safetyStockQuantity, unitPrice }) =>
        safetyStockQuantity.value * unitPrice.value
      );
  }

  validate(dataSource: ValidationDataSource): ValidationFn {
    return dataSource
      .mustBePositiveOrZero()
      .validate();
  }
}
