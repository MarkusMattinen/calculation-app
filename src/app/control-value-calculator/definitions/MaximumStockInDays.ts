import { CalculationDataSource, CalculationFn, ControlValueCalculation, IsEditableFn } from '../CalculationDataSource';
import { LockDataSource } from '../LockDataSource';

export class MaximumStockInDays implements ControlValueCalculation<number> {
  calculate(dataSource: CalculationDataSource): CalculationFn {
    return dataSource.tryInOrder(
      this.calculateFromMaximumStockQuantity(dataSource),
      this.calculateFromSafetyStock(dataSource)
    );
  }

  isEditable(dataSource: LockDataSource): IsEditableFn {
    return dataSource
      .useLocks('maximumStockQuantity')
      .editableWhen(({ maximumStockQuantityLocked }) => !maximumStockQuantityLocked);
  }

  private calculateFromSafetyStock(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .onlyWhenAllNotNull('orderLotInDays')
      .useValues('safetyStockInDays', 'safetyStockQuantity', 'safetyStockValue')
      .onlyWhenAnyExplicitlySet('safetyStockInDays', 'safetyStockQuantity', 'safetyStockValue')
      .validatePositiveValue('orderLotInDays', 'safetyStockInDays')
      .calculate(({ orderLotInDays, safetyStockInDays }) =>
        orderLotInDays.value + safetyStockInDays.value
      );
  }

  private calculateFromMaximumStockQuantity(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValues('maximumStockQuantity', 'maximumStockValue', 'dailyConsumptionQuantityTarget')
      .onlyWhenAnyExplicitlySet('maximumStockQuantity', 'maximumStockValue')
      .validatePositiveValue('maximumStockQuantity', 'dailyConsumptionQuantityTarget')
      .calculate(({ maximumStockQuantity, dailyConsumptionQuantityTarget }) =>
        maximumStockQuantity.value / dailyConsumptionQuantityTarget.value
      );
  }
}
