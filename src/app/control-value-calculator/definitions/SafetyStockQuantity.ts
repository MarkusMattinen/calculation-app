import { CalculationDataSource, CalculationFn, ControlValueCalculation, IsEditableFn, ValidationFn } from '../CalculationDataSource';
import { LockDataSource } from '../LockDataSource';
import { ValidationDataSource } from '../ValidationDataSource';

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

  validate(dataSource: ValidationDataSource): ValidationFn {
    return dataSource
      .mustBePositiveOrZero()
      .validate();
  }

  private calculateFromSafetyStockInDays(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValuesDistinct('safetyStockInDays', 'dailyConsumptionQuantityTarget')
      .validatePositiveValue('dailyConsumptionQuantityTarget')
      .validatePositiveOrZeroValue('safetyStockInDays')
      .calculate(({ safetyStockInDays, dailyConsumptionQuantityTarget }) =>
        safetyStockInDays.value * dailyConsumptionQuantityTarget.value
      );
  }

  private calculateFromSafetyStockValue(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValuesDistinct('safetyStockValue', 'unitPrice')
      .onlyWhenAnyExplicitlySet('safetyStockValue')
      .validatePositiveValue('unitPrice')
      .validatePositiveOrZeroValue('safetyStockValue')
      .calculate(({ safetyStockValue, unitPrice }) =>
        safetyStockValue.value / unitPrice.value
      );
  }
}
