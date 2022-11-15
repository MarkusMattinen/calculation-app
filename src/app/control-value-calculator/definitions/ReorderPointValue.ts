import { CalculationDataSource, CalculationFn, ControlValueCalculation, ValidationFn } from '../CalculationDataSource';
import { ValidationDataSource } from '../ValidationDataSource';

export class ReorderPointValue implements ControlValueCalculation<number> {
  calculate(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValuesDistinct('reorderPointQuantity', 'unitPrice')
      .validatePositiveValue('unitPrice')
      .validatePositiveOrZeroValue('reorderPointQuantity')
      .calculate(({ reorderPointQuantity, unitPrice }) =>
        reorderPointQuantity.value * unitPrice.value
      );
  }

  validate(dataSource: ValidationDataSource): ValidationFn {
    return dataSource
      .mustBePositiveOrZero()
      .validate();
  }
}
