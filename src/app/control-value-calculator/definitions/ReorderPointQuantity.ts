import { CalculationDataSource, CalculationFn, ControlValueCalculation, ValidationFn } from '../CalculationDataSource';
import { ValidationDataSource } from '../ValidationDataSource';

export class ReorderPointQuantity implements ControlValueCalculation<number> {
  calculate(dataSource: CalculationDataSource): CalculationFn {
    return this.calculateFromSafetyStock(dataSource);
  }

  validate(dataSource: ValidationDataSource): ValidationFn {
    return dataSource
      .mustBePositiveOrZero()
      .validate();
  }

  private calculateFromSafetyStock(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValuesDistinct('safetyStockQuantity', 'leadTimeConsumptionQuantity')
      .validatePositiveOrZeroValue('safetyStockQuantity', 'leadTimeConsumptionQuantity')
      .calculate(({ safetyStockQuantity, leadTimeConsumptionQuantity }) =>
        safetyStockQuantity.value + leadTimeConsumptionQuantity.value
      );
  }
}
