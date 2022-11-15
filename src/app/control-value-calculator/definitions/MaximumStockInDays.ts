import { CalculationDataSource, CalculationFn, ControlValueCalculation, IsEditableFn, ValidationFn } from '../CalculationDataSource';
import { LockDataSource } from '../LockDataSource';
import { ValidationDataSource } from '../ValidationDataSource';

export class MaximumStockInDays implements ControlValueCalculation<number> {
  calculate(dataSource: CalculationDataSource): CalculationFn {
    return dataSource.merge(
      this.calculateFromMaximumStockQuantity(dataSource),
      this.calculateFromSafetyStock(dataSource)
    );
  }

  isEditable(dataSource: LockDataSource): IsEditableFn {
    return dataSource
      .useLocks('maximumStockQuantity')
      .editableWhen(({ maximumStockQuantityLocked }) => !maximumStockQuantityLocked);
  }

  validate(dataSource: ValidationDataSource): ValidationFn {
    return dataSource
      .mustBePositive()
      .validate();
  }

  private calculateFromSafetyStock(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValuesDistinct('safetyStockInDays')
      .useValues('orderLotInDays') // Not recalculated when orderLotInDays changes
      .onlyWhenAnyExplicitlySet('safetyStockInDays', 'safetyStockQuantity', 'safetyStockValue')
      .validatePositiveValue('orderLotInDays')
      .validatePositiveOrZeroValue('safetyStockInDays')
      .calculate(({ orderLotInDays, safetyStockInDays }) =>
        orderLotInDays.value + safetyStockInDays.value
      );
  }

  private calculateFromMaximumStockQuantity(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValuesDistinct('maximumStockQuantity', 'dailyConsumptionQuantityTarget')
      .onlyWhenAnyExplicitlySet('maximumStockQuantity', 'maximumStockValue')
      .validatePositiveValue('maximumStockQuantity', 'dailyConsumptionQuantityTarget')
      .calculate(({ maximumStockQuantity, dailyConsumptionQuantityTarget }) =>
        maximumStockQuantity.value / dailyConsumptionQuantityTarget.value
      );
  }
}
