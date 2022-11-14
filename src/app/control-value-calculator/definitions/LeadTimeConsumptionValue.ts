import { CalculationDataSource, CalculationFn, ControlValueCalculation } from '../CalculationDataSource';

export class LeadTimeConsumptionValue implements ControlValueCalculation<number> {
  calculate(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValues('leadTimeConsumptionQuantity', 'unitPrice')
      .calculate(({ leadTimeConsumptionQuantity, unitPrice }) =>
        leadTimeConsumptionQuantity.value * unitPrice.value
      );
  }
}
