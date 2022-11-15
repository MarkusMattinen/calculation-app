import { CalculationDataSource, CalculationFn, ControlValueCalculation, IsEditableFn, ValidationFn } from '../CalculationDataSource';
import { LockDataSource } from '../LockDataSource';
import { ValidationDataSource } from '../ValidationDataSource';

export class OrderLotInDays implements ControlValueCalculation<number> {
  calculate(dataSource: CalculationDataSource): CalculationFn {
    return dataSource.merge(
      this.calculateFromOrderLotQuantity(dataSource),
      this.calculateFromMaximumStock(dataSource)
    );
  }

  isEditable(dataSource: LockDataSource): IsEditableFn {
    return dataSource
      .useLocks('orderLotQuantity')
      .editableWhen(({ orderLotQuantityLocked }) => !orderLotQuantityLocked);
  }

  validate(dataSource: ValidationDataSource): ValidationFn {
    return dataSource
      .mustBePositive()
      .validate();
  }

  private calculateFromMaximumStock(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValuesDistinct('maximumStockInDays')
      .useValues('safetyStockInDays') // Not recalculated when safetyStockInDays changes
      .onlyWhenAnyExplicitlySet('maximumStockInDays', 'maximumStockQuantity', 'maximumStockValue')
      .validatePositiveValue('maximumStockInDays')
      .validatePositiveOrZeroValue('safetyStockInDays')
      .calculate(({ maximumStockInDays, safetyStockInDays }) =>
        maximumStockInDays.value - safetyStockInDays.value
      );
  }

  private calculateFromOrderLotQuantity(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValuesDistinct('orderLotQuantity', 'dailyConsumptionQuantityTarget')
      .onlyWhenAnyExplicitlySet('orderLotQuantity', 'orderLotValue')
      .validatePositiveValue('orderLotQuantity', 'dailyConsumptionQuantityTarget')
      .calculate(({ orderLotQuantity, dailyConsumptionQuantityTarget }) =>
        orderLotQuantity.value / dailyConsumptionQuantityTarget.value
      );
  }}
