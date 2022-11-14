import { CalculationDataSource, CalculationFn, ControlValueCalculation } from '../CalculationDataSource';

export class TotalCost implements ControlValueCalculation<number> {
  calculate(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValues('labourCost', 'warehousingCost')
      .calculate(({ labourCost, warehousingCost }) =>
        labourCost.value + warehousingCost.value
      );
  }
}
