import { CalculationDataSource, CalculationFn, ControlValueCalculation } from '../CalculationDataSource';

export class WarehousingCost implements ControlValueCalculation<number> {
  calculate(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValues('averageStockValue', 'warehousingCostPercentage')
      .calculate(({ averageStockValue, warehousingCostPercentage }) =>
        averageStockValue.value * warehousingCostPercentage.value
      );
  }
}
