import { CalculationDataSource, CalculationFn, ControlValueCalculation } from '../CalculationDataSource';

export class AverageStockValue implements ControlValueCalculation<number> {
  calculate(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValues('averageStockInDays', 'unitPrice')
      .calculate(({ averageStockInDays, unitPrice }) =>
        averageStockInDays.value * unitPrice.value
      );
  }
}
