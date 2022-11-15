import { ValidationFn } from './../CalculationDataSource';
import { ValidationDataSource } from './../ValidationDataSource';
import { CalculationDataSource, CalculationFn, ControlValueCalculation, IsEditableFn } from '../CalculationDataSource';
import { LockDataSource } from '../LockDataSource';

export class SafetyStockInDays implements ControlValueCalculation<number> {
  calculate(dataSource: CalculationDataSource): CalculationFn {
    return this.calculateFromSafetyStockQuantity(dataSource);
  }

  isEditable(dataSource: LockDataSource): IsEditableFn {
    return dataSource
      .useLocks('safetyStockQuantity')
      .editableWhen(({ safetyStockQuantityLocked }) => !safetyStockQuantityLocked);
  }

  validate(dataSource: ValidationDataSource): ValidationFn {
    return dataSource
      .mustBePositiveOrZero()
      .validate();
  }

  private calculateFromSafetyStockQuantity(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValuesDistinct('safetyStockQuantity', 'dailyConsumptionQuantityTarget')
      .onlyWhenAnyExplicitlySet('safetyStockQuantity', 'safetyStockValue')
      .validatePositiveValue('dailyConsumptionQuantityTarget')
      .validatePositiveOrZeroValue('safetyStockQuantity')
      .calculate(({ safetyStockQuantity, dailyConsumptionQuantityTarget }) =>
        safetyStockQuantity.value / dailyConsumptionQuantityTarget.value
      );
  }
}
