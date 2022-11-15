import { CalculationDataSource, CalculationFn, ControlValueCalculation, ValidationFn } from '../CalculationDataSource';
import { ValidationDataSource } from '../ValidationDataSource';

export class AverageStockInDays implements ControlValueCalculation<number> {
  calculate(dataSource: CalculationDataSource): CalculationFn {
    return this.calculateFromStockLimits(dataSource);
  }

  validate(dataSource: ValidationDataSource): ValidationFn {
    return dataSource
      .mustBePositive()
      .validate();
  }

  private calculateFromStockLimits(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValuesDistinct('safetyStockInDays', 'maximumStockInDays')
      .validatePositiveValue('maximumStockInDays')
      .validatePositiveOrZeroValue('safetyStockInDays')
      .calculate(({ safetyStockInDays, maximumStockInDays }) =>
        safetyStockInDays.value + (maximumStockInDays.value - safetyStockInDays.value) / 2
      );
  }
}
