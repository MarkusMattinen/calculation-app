import { CalculationDataSource, CalculationFn, ControlValueCalculation, ValidationFn } from '../CalculationDataSource';
import { ValidationDataSource } from '../ValidationDataSource';

export class LeadTimeConsumptionQuantity implements ControlValueCalculation<number> {
  calculate(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValuesDistinct('leadTimeInDays', 'dailyConsumptionQuantityTarget')
      .validatePositiveValue('dailyConsumptionQuantityTarget')
      .validatePositiveOrZeroValue('leadTimeInDays')
      .calculate(({ leadTimeInDays, dailyConsumptionQuantityTarget }) =>
        leadTimeInDays.value * dailyConsumptionQuantityTarget.value
      );
  }

  validate(dataSource: ValidationDataSource): ValidationFn {
    return dataSource
      .mustBePositiveOrZero()
      .validate();
  }
}
