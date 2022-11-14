import { CalculationDataSource, CalculationFn, ControlValueCalculation } from '../CalculationDataSource';

export class WeeklyConsumptionQuantityTargetValue implements ControlValueCalculation<number> {
  calculate(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValues('weeklyConsumptionQuantityTarget', 'unitPrice')
      .calculate(({ weeklyConsumptionQuantityTarget, unitPrice }) =>
        weeklyConsumptionQuantityTarget.value * unitPrice.value
      );
  }
}
