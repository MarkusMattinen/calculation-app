import { CalculationDataSource, CalculationFn, ControlValueCalculation, ValidationFn } from '../CalculationDataSource';
import { ValidationDataSource } from '../ValidationDataSource';

export class LeadTimeConsumptionValue implements ControlValueCalculation<number> {
  calculate(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValuesDistinct('leadTimeConsumptionQuantity', 'unitPrice')
      .validatePositiveValue('unitPrice')
      .validatePositiveOrZeroValue('leadTimeConsumptionQuantity')
      .calculate(({ leadTimeConsumptionQuantity, unitPrice }) =>
        leadTimeConsumptionQuantity.value * unitPrice.value
      );
  }

  validate(dataSource: ValidationDataSource): ValidationFn {
    return dataSource
      .mustBePositiveOrZero()
      .validate();
  }
}
