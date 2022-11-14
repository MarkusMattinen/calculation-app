import { CalculationDataSource, CalculationFn, ControlValueCalculation, IsEditableFn } from '../CalculationDataSource';
import { LockDataSource } from '../LockDataSource';

export class OrderLotInDays implements ControlValueCalculation<number> {
  calculate(dataSource: CalculationDataSource): CalculationFn {
    return dataSource.tryInOrder(
      this.calculateFromOrderLotQuantity(dataSource),
      this.calculateFromMaximumStock(dataSource)
    );
  }

  isEditable(dataSource: LockDataSource): IsEditableFn {
    return dataSource
      .useLocks('orderLotQuantity')
      .editableWhen(({ orderLotQuantityLocked }) => !orderLotQuantityLocked);
  }

  private calculateFromMaximumStock(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .onlyWhenAllNotNull('safetyStockInDays')
      .useValues('maximumStockInDays', 'maximumStockQuantity', 'maximumStockValue')
      .onlyWhenAnyExplicitlySet('maximumStockInDays', 'maximumStockQuantity', 'maximumStockValue')
      .validatePositiveValue('maximumStockInDays', 'safetyStockInDays')
      .validatePositiveResult()
      .calculate(({ maximumStockInDays, safetyStockInDays }) =>
        maximumStockInDays.value - safetyStockInDays.value
      );
  }

  private calculateFromOrderLotQuantity(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValues('orderLotQuantity', 'orderLotValue', 'dailyConsumptionQuantityTarget')
      .onlyWhenAnyExplicitlySet('orderLotQuantity', 'orderLotValue')
      .validatePositiveValue('orderLotQuantity', 'dailyConsumptionQuantityTarget')
      .calculate(({ orderLotQuantity, dailyConsumptionQuantityTarget }) =>
        orderLotQuantity.value / dailyConsumptionQuantityTarget.value
      );
  }}
