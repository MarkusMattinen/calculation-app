import { CalculationDataSource, CalculationFn, ControlValueCalculation, IsEditableFn, ValidationFn } from '../CalculationDataSource';
import { LockDataSource } from '../LockDataSource';
import { ValidationDataSource } from '../ValidationDataSource';

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

  validate(dataSource: ValidationDataSource): ValidationFn {
    return dataSource
      .mustBePositive()
      .validate();
  }

  private calculateFromMaximumStockInDays(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValuesDistinct('maximumStockInDays', 'dailyConsumptionQuantityTarget')
      .validatePositiveValue('maximumStockInDays', 'dailyConsumptionQuantityTarget')
      .calculate(({ maximumStockInDays, dailyConsumptionQuantityTarget }) =>
        maximumStockInDays.value * dailyConsumptionQuantityTarget.value
      );
  }

  private calculateFromMaximumStockValue(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValuesDistinct('maximumStockValue', 'unitPrice')
      .onlyWhenAnyExplicitlySet('maximumStockValue')
      .validatePositiveValue('maximumStockValue', 'unitPrice')
      .calculate(({ maximumStockValue, unitPrice }) =>
        maximumStockValue.value / unitPrice.value
      );
  }
}
