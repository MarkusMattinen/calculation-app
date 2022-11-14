import { CalculationDataSource, CalculationFn, ControlValueCalculation } from '../CalculationDataSource';

export class AverageStockInDays implements ControlValueCalculation<number> {
  calculate(dataSource: CalculationDataSource): CalculationFn {
    return dataSource.tryInOrder(
      this.calculateFromStockLimits(dataSource)
    );
  }

  private calculateFromStockLimits(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValues('safetyStockInDays', 'maximumStockInDays')
      .calculate(({ safetyStockInDays, maximumStockInDays }) =>
        safetyStockInDays.value + (maximumStockInDays.value - safetyStockInDays.value) / 2
      );
  }
}
