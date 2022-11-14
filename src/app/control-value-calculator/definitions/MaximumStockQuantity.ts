import { CalculationDataSource, CalculationFn, ControlValueCalculation, IsEditableFn } from '../CalculationDataSource';
import { LockDataSource } from '../LockDataSource';

export class MaximumStockQuantity implements ControlValueCalculation<number> {
  calculate(dataSource: CalculationDataSource): CalculationFn {
    return dataSource.tryInOrder(
      this.calculateFromMaximumStockValue(dataSource),
      this.calculateFromMaximumStockInDays(dataSource)
    );
  }

  isEditable(dataSource: LockDataSource): IsEditableFn {
    return dataSource
      .useLocks('maximumStockInDays')
      .editableWhen(({ maximumStockInDaysLocked }) => !maximumStockInDaysLocked);
  }

  private calculateFromMaximumStockInDays(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValues('maximumStockInDays', 'dailyConsumptionQuantityTarget')
      .validatePositiveValue('maximumStockInDays', 'dailyConsumptionQuantityTarget')
      .calculate(({ maximumStockInDays, dailyConsumptionQuantityTarget }) =>
        maximumStockInDays.value * dailyConsumptionQuantityTarget.value
      );
  }

  private calculateFromMaximumStockValue(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValues('maximumStockValue', 'unitPrice')
      .onlyWhenAnyExplicitlySet('maximumStockValue')
      .validatePositiveValue('maximumStockValue', 'unitPrice')
      .calculate(({ maximumStockValue, unitPrice }) =>
        maximumStockValue.value / unitPrice.value
      );
  }
}
