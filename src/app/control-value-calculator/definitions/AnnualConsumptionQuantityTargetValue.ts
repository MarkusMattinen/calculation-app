import { CalculationDataSource, CalculationFn, ControlValueCalculation, ValidationFn } from '../CalculationDataSource';
import { ValidationDataSource } from '../ValidationDataSource';

export class AnnualConsumptionQuantityTargetValue implements ControlValueCalculation<number> {
  calculate(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValuesDistinct('annualConsumptionQuantityTarget', 'unitPrice')
      .validatePositiveValue('annualConsumptionQuantityTarget', 'unitPrice')
      .calculate(({ annualConsumptionQuantityTarget, unitPrice }) =>
        annualConsumptionQuantityTarget.value * unitPrice.value
      );
  }

  validate(dataSource: ValidationDataSource): ValidationFn {
    return dataSource
      .mustBePositive()
      .validate();
  }
}
