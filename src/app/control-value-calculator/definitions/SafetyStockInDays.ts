import { CalculationDataSource, CalculationFn, ControlValueCalculation, IsEditableFn } from '../CalculationDataSource';
import { LockDataSource } from '../LockDataSource';

export class SafetyStockInDays implements ControlValueCalculation<number> {
  calculate(dataSource: CalculationDataSource): CalculationFn {
    return dataSource.tryInOrder(
      this.calculateFromSafetyStockQuantity(dataSource)
    );
  }

  isEditable(dataSource: LockDataSource): IsEditableFn {
    return dataSource
      .useLocks('safetyStockQuantity')
      .editableWhen(({ safetyStockQuantityLocked }) => !safetyStockQuantityLocked);
  }

  private calculateFromSafetyStockQuantity(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValues('safetyStockQuantity', 'safetyStockValue', 'dailyConsumptionQuantityTarget')
      .onlyWhenAnyExplicitlySet('safetyStockQuantity', 'safetyStockValue')
      .validatePositiveValue('safetyStockQuantity', 'dailyConsumptionQuantityTarget')
      .calculate(({ safetyStockQuantity, dailyConsumptionQuantityTarget }) =>
        safetyStockQuantity.value / dailyConsumptionQuantityTarget.value
      );
  }
}
