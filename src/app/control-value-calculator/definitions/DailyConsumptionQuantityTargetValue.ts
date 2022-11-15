import { CalculationDataSource, CalculationFn, ControlValueCalculation, ValidationFn } from '../CalculationDataSource';
import { ValidationDataSource } from '../ValidationDataSource';

export class DailyConsumptionQuantityTargetValue implements ControlValueCalculation<number> {
  calculate(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValuesDistinct('dailyConsumptionQuantityTarget', 'unitPrice')
      .validatePositiveValue('dailyConsumptionQuantityTarget', 'unitPrice')
      .calculate(({ dailyConsumptionQuantityTarget, unitPrice }) =>
        dailyConsumptionQuantityTarget.value * unitPrice.value
      );
  }

  validate(dataSource: ValidationDataSource): ValidationFn {
    return dataSource
      .mustBePositive()
      .validate();
  }
}
