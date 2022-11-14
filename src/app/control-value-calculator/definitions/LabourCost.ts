import { CalculationDataSource, CalculationFn, ControlValueCalculation } from '../CalculationDataSource';

export class LabourCost implements ControlValueCalculation<number> {
  calculate(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValues('incomingStockTransactionQuantityTarget', 'orderHandlingCost')
      .calculate(({ incomingStockTransactionQuantityTarget, orderHandlingCost }) =>
        incomingStockTransactionQuantityTarget.value * orderHandlingCost.value
      );
  }
}
