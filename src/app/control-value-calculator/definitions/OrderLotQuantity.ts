import { CalculationDataSource, CalculationFn, ControlValueCalculation, IsEditableFn } from '../CalculationDataSource';
import { LockDataSource } from '../LockDataSource';

export class OrderLotQuantity implements ControlValueCalculation<number> {
  calculate(dataSource: CalculationDataSource): CalculationFn {
    return dataSource.tryInOrder(
      this.calculateFromOrderLotValue(dataSource),
      this.calculateFromOrderLotInDays(dataSource)
    );
  }

  isEditable(dataSource: LockDataSource): IsEditableFn {
    return dataSource
      .useLocks('orderLotInDays')
      .editableWhen(({ orderLotInDaysLocked }) => !orderLotInDaysLocked);
  }

  private calculateFromOrderLotInDays(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValues('orderLotInDays', 'dailyConsumptionQuantityTarget')
      .validatePositiveValue('orderLotInDays', 'dailyConsumptionQuantityTarget')
      .calculate(({ orderLotInDays, dailyConsumptionQuantityTarget }) =>
        orderLotInDays.value * dailyConsumptionQuantityTarget.value
      );
  }

  private calculateFromOrderLotValue(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValues('orderLotValue', 'unitPrice')
      .onlyWhenAnyExplicitlySet('orderLotValue')
      .validatePositiveValue('orderLotValue', 'unitPrice')
      .calculate(({ orderLotValue, unitPrice }) =>
        orderLotValue.value / unitPrice.value
      );
  }
}
