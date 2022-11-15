import { CalculationDataSource, CalculationFn, ControlValueCalculation, ValidationFn } from '../CalculationDataSource';
import { ValidationDataSource } from '../ValidationDataSource';

export class WarehousingCost implements ControlValueCalculation<number> {
  calculate(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValuesDistinct('averageStockValue', 'warehousingCostPercentage')
      .validatePositiveValue('averageStockValue')
      .validatePositiveOrZeroValue('warehousingCostPercentage')
      .calculate(({ averageStockValue, warehousingCostPercentage }) =>
        averageStockValue.value * warehousingCostPercentage.value
      );
  }

  validate(dataSource: ValidationDataSource): ValidationFn {
    return dataSource
      .mustBePositiveOrZero()
      .validate();
  }
}
