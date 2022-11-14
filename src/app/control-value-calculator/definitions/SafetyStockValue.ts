import { CalculationDataSource, CalculationFn, ControlValueCalculation } from '../CalculationDataSource';

export class SafetyStockValue implements ControlValueCalculation<number> {
  calculate(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValues('safetyStockQuantity', 'unitPrice')
      .calculate(({ safetyStockQuantity, unitPrice }) =>
        safetyStockQuantity.value * unitPrice.value
      );
  }
}
