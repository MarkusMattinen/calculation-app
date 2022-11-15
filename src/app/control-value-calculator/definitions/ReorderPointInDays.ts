import { CalculationDataSource, CalculationFn, ControlValueCalculation, ValidationFn } from '../CalculationDataSource';
import { ValidationDataSource } from '../ValidationDataSource';

export class ReorderPointInDays implements ControlValueCalculation<number> {
  calculate(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValuesDistinct('reorderPointQuantity', 'annualConsumptionQuantityTarget', 'daysInYear')
      .validatePositiveValue('annualConsumptionQuantityTarget', 'daysInYear')
      .validatePositiveOrZeroValue('reorderPointQuantity')
      .calculate(({ reorderPointQuantity, annualConsumptionQuantityTarget, daysInYear }) =>
        reorderPointQuantity.value / (annualConsumptionQuantityTarget.value / daysInYear.value)
      );
  }

  validate(dataSource: ValidationDataSource): ValidationFn {
    return dataSource
      .mustBePositiveOrZero()
      .validate();
  }
}
