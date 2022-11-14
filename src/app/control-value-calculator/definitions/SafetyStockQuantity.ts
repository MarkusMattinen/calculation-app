import { CalculationDataSource, CalculationFn, ControlValueCalculation, IsEditableFn } from '../CalculationDataSource';
import { LockDataSource } from '../LockDataSource';

export class SafetyStockQuantity implements ControlValueCalculation<number> {
  calculate(dataSource: CalculationDataSource): CalculationFn {
    return dataSource.tryInOrder(
      this.calculateFromSafetyStockValue(dataSource),
      this.calculateFromSafetyStockInDays(dataSource)
    );
  }

  isEditable(dataSource: LockDataSource): IsEditableFn {
    return dataSource
      .useLocks('safetyStockInDays')
      .editableWhen(({ safetyStockInDaysLocked }) => !safetyStockInDaysLocked);
  }

  private calculateFromSafetyStockInDays(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValues('safetyStockInDays', 'dailyConsumptionQuantityTarget')
      .validatePositiveValue('safetyStockInDays', 'dailyConsumptionQuantityTarget')
      .calculate(({ safetyStockInDays, dailyConsumptionQuantityTarget }) =>
        safetyStockInDays.value * dailyConsumptionQuantityTarget.value
      );
  }

  private calculateFromSafetyStockValue(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValues('safetyStockValue', 'unitPrice')
      .onlyWhenAnyExplicitlySet('safetyStockValue')
      .validatePositiveValue('safetyStockValue', 'unitPrice')
      .calculate(({ safetyStockValue, unitPrice }) =>
        safetyStockValue.value / unitPrice.value
      );
  }
}
