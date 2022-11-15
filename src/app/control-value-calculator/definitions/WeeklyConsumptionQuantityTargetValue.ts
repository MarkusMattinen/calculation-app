import { CalculationDataSource, CalculationFn, ControlValueCalculation, ValidationFn } from '../CalculationDataSource';
import { ValidationDataSource } from '../ValidationDataSource';

export class WeeklyConsumptionQuantityTargetValue implements ControlValueCalculation<number> {
  calculate(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValuesDistinct('weeklyConsumptionQuantityTarget', 'unitPrice')
      .validatePositiveValue('weeklyConsumptionQuantityTarget', 'unitPrice')
      .calculate(({ weeklyConsumptionQuantityTarget, unitPrice }) =>
        weeklyConsumptionQuantityTarget.value * unitPrice.value
      );
  }

  validate(dataSource: ValidationDataSource): ValidationFn {
    return dataSource
      .mustBePositive()
      .validate();
  }
}
