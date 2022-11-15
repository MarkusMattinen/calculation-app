import { CalculationDataSource, CalculationFn, ControlValueCalculation, ValidationFn } from '../CalculationDataSource';
import { ValidationDataSource } from '../ValidationDataSource';

export class UnitPriceCostPercentage implements ControlValueCalculation<number> {
  calculate(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValuesDistinct('unitPriceWithCosts', 'unitPrice')
      .validatePositiveValue('unitPriceWithCosts', 'unitPrice')
      .calculate(({ unitPriceWithCosts, unitPrice }) =>
        (unitPriceWithCosts.value - unitPrice.value) / unitPriceWithCosts.value * 100
      );
  }

  validate(dataSource: ValidationDataSource): ValidationFn {
    return dataSource
      .mustBePositiveOrZero()
      .validate();
  }
}
