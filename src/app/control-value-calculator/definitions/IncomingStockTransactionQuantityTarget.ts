import { CalculationDataSource, CalculationFn, ControlValueCalculation, ValidationFn } from '../CalculationDataSource';
import { ValidationDataSource } from '../ValidationDataSource';

export class IncomingStockTransactionQuantityTarget implements ControlValueCalculation<number> {
  calculate(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValuesDistinct('daysInYear', 'orderLotInDays')
      .validatePositiveValue('daysInYear', 'orderLotInDays')
      .calculate(({ daysInYear, orderLotInDays }) =>
        daysInYear.value / orderLotInDays.value
      );
  }

  validate(dataSource: ValidationDataSource): ValidationFn {
    return dataSource
      .mustBePositiveOrZero()
      .validate();
  }
}
