import { CalculationDataSource, CalculationFn, ControlValueCalculation, IsEditableFn, ValidationFn } from '../CalculationDataSource';
import { LockDataSource } from '../LockDataSource';
import { ValidationDataSource } from '../ValidationDataSource';

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

  validate(dataSource: ValidationDataSource): ValidationFn {
    return dataSource
      .mustBePositive()
      .validate();
  }

  private calculateFromOrderLotInDays(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValuesDistinct('orderLotInDays', 'dailyConsumptionQuantityTarget')
      .validatePositiveValue('orderLotInDays', 'dailyConsumptionQuantityTarget')
      .calculate(({ orderLotInDays, dailyConsumptionQuantityTarget }) =>
        orderLotInDays.value * dailyConsumptionQuantityTarget.value
      );
  }

  private calculateFromOrderLotValue(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValuesDistinct('orderLotValue', 'unitPrice')
      .onlyWhenAnyExplicitlySet('orderLotValue')
      .validatePositiveValue('orderLotValue', 'unitPrice')
      .calculate(({ orderLotValue, unitPrice }) =>
        orderLotValue.value / unitPrice.value
      );
  }
}
