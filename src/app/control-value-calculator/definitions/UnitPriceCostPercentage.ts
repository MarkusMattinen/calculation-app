import { CalculationDataSource, CalculationFn, ControlValueCalculation } from '../CalculationDataSource';

export class UnitPriceCostPercentage implements ControlValueCalculation<number> {
  calculate(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValues('unitPriceWithCosts', 'unitPrice')
      .calculate(({ unitPriceWithCosts, unitPrice }) =>
        (unitPriceWithCosts.value - unitPrice.value) / unitPriceWithCosts.value * 100
      );
  }
}
