import { CalculationDataSource, CalculationFn, ControlValueCalculation, ValidationFn } from '../CalculationDataSource';
import { ValidationDataSource } from '../ValidationDataSource';

export class UnitPriceWithCosts implements ControlValueCalculation<number> {
  calculate(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValuesDistinct('unitPrice', 'totalCost', 'annualConsumptionQuantityTarget')
      .validatePositiveValue('unitPrice', 'totalCost', 'annualConsumptionQuantityTarget')
      .calculate(({ unitPrice, totalCost, annualConsumptionQuantityTarget }) =>
        unitPrice.value + (totalCost.value / annualConsumptionQuantityTarget.value)
      );
  }

  validate(dataSource: ValidationDataSource): ValidationFn {
    return dataSource
      .mustBePositiveOrZero()
      .validate();
  }
}
