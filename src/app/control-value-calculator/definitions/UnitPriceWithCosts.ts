import { CalculationDataSource, CalculationFn, ControlValueCalculation } from '../CalculationDataSource';

export class UnitPriceWithCosts implements ControlValueCalculation<number> {
  calculate(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValues('unitPrice', 'totalCost', 'annualConsumptionQuantityTarget')
      .calculate(({ unitPrice, totalCost, annualConsumptionQuantityTarget }) =>
        unitPrice.value + (totalCost.value / annualConsumptionQuantityTarget.value)
      );
  }
}
