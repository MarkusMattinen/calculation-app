import { CalculationDataSource, CalculationFn, ControlValueCalculation } from '../CalculationDataSource';

export class ReorderPointInDays implements ControlValueCalculation<number> {
  calculate(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValues('reorderPointQuantity', 'annualConsumptionQuantityTarget', 'daysInYear')
      .calculate(({ reorderPointQuantity, annualConsumptionQuantityTarget, daysInYear }) =>
        reorderPointQuantity.value / (annualConsumptionQuantityTarget.value / daysInYear.value)
      );
  }
}
