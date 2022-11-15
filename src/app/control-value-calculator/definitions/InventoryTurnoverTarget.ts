import { CalculationDataSource, CalculationFn, ControlValueCalculation, ValidationFn } from '../CalculationDataSource';
import { ValidationDataSource } from '../ValidationDataSource';

export class InventoryTurnoverTarget implements ControlValueCalculation<number> {
  calculate(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValuesDistinct('daysInYear', 'averageStockInDays')
      .validatePositiveValue('daysInYear', 'averageStockInDays')
      .calculate(({ daysInYear, averageStockInDays }) =>
        daysInYear.value / averageStockInDays.value
      );
  }

  validate(dataSource: ValidationDataSource): ValidationFn {
    return dataSource
      .mustBePositiveOrZero()
      .validate();
  }
}
