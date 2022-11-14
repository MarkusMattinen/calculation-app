import { CalculationDataSource, CalculationFn, ControlValueCalculation } from '../CalculationDataSource';

export class ReorderPointQuantity implements ControlValueCalculation<number> {
  calculate(dataSource: CalculationDataSource): CalculationFn {
    return dataSource.tryInOrder(
      this.calculateFromSafetyStock(dataSource)
    );
  }

  private calculateFromSafetyStock(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValues('safetyStockQuantity', 'leadTimeConsumptionQuantity')
      .validatePositiveValue('safetyStockQuantity', 'leadTimeConsumptionQuantity')
      .calculate(({ safetyStockQuantity, leadTimeConsumptionQuantity }) =>
        safetyStockQuantity.value + leadTimeConsumptionQuantity.value
      );
  }
}
