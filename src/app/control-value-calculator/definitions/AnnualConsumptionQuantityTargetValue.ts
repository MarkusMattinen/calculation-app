import { CalculationDataSource, CalculationFn, ControlValueCalculation } from '../CalculationDataSource';

export class AnnualConsumptionQuantityTargetValue implements ControlValueCalculation<number> {
  calculate(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValues('annualConsumptionQuantityTarget', 'unitPrice')
      .calculate(({ annualConsumptionQuantityTarget, unitPrice }) =>
        annualConsumptionQuantityTarget.value * unitPrice.value
      );
  }
}
