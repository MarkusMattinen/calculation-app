import { CalculationDataSource, CalculationFn, ControlValueCalculation, ValidationFn } from '../CalculationDataSource';
import { ValidationDataSource } from '../ValidationDataSource';

export class LabourCost implements ControlValueCalculation<number> {
  calculate(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValuesDistinct('incomingStockTransactionQuantityTarget', 'orderHandlingCost')
      .validatePositiveValue('incomingStockTransactionQuantityTarget')
      .validatePositiveOrZeroValue('orderHandlingCost')
      .calculate(({ incomingStockTransactionQuantityTarget, orderHandlingCost }) =>
        incomingStockTransactionQuantityTarget.value * orderHandlingCost.value
      );
  }

  validate(dataSource: ValidationDataSource): ValidationFn {
    return dataSource
      .mustBePositiveOrZero()
      .validate();
  }
}
