import { CalculationDataSource, CalculationFn, ControlValueCalculation } from '../CalculationDataSource';

export class InventoryTurnoverTarget implements ControlValueCalculation<number> {
  calculate(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValues('daysInYear', 'averageStockInDays')
      .validatePositiveValue('daysInYear', 'averageStockInDays')
      .calculate(({ daysInYear, averageStockInDays }) =>
        daysInYear.value / averageStockInDays.value
      );
  }
}
