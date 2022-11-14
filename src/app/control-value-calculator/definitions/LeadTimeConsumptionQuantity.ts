import { CalculationDataSource, CalculationFn, ControlValueCalculation } from '../CalculationDataSource';

export class LeadTimeConsumptionQuantity implements ControlValueCalculation<number> {
  calculate(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValues('leadTimeInDays', 'dailyConsumptionQuantityTarget')
      .calculate(({ leadTimeInDays, dailyConsumptionQuantityTarget }) =>
        leadTimeInDays.value * dailyConsumptionQuantityTarget.value
      );
  }
}
