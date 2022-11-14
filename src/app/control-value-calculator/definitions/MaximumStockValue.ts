import { CalculationDataSource, CalculationFn, ControlValueCalculation } from '../CalculationDataSource';

export class MaximumStockValue implements ControlValueCalculation<number> {
  calculate(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValues('maximumStockQuantity', 'unitPrice')
      .calculate(({ maximumStockQuantity, unitPrice }) =>
        maximumStockQuantity.value * unitPrice.value
      );
  }
}
