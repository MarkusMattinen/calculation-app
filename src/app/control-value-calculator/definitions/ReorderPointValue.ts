import { CalculationDataSource, CalculationFn, ControlValueCalculation } from '../CalculationDataSource';

export class ReorderPointValue implements ControlValueCalculation<number> {
  calculate(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValues('reorderPointQuantity', 'unitPrice')
      .calculate(({ reorderPointQuantity, unitPrice }) =>
        reorderPointQuantity.value * unitPrice.value
      );
  }
}
