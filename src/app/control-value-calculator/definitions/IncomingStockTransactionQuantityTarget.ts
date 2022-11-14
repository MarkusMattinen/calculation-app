import { CalculationDataSource, CalculationFn, ControlValueCalculation } from '../CalculationDataSource';

export class IncomingStockTransactionQuantityTarget implements ControlValueCalculation<number> {
  calculate(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValues('daysInYear', 'orderLotInDays')
      .validatePositiveValue('daysInYear', 'orderLotInDays')
      .calculate(({ daysInYear, orderLotInDays }) =>
        daysInYear.value / orderLotInDays.value
      );
  }
}
