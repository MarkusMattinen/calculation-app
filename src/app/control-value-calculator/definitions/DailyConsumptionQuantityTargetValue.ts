import { CalculationDataSource, CalculationFn, ControlValueCalculation } from '../CalculationDataSource';

export class DailyConsumptionQuantityTargetValue implements ControlValueCalculation<number> {
  calculate(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValues('dailyConsumptionQuantityTarget', 'unitPrice')
      .calculate(({ dailyConsumptionQuantityTarget, unitPrice }) =>
        dailyConsumptionQuantityTarget.value * unitPrice.value
      );
  }
}
