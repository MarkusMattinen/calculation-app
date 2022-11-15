import { CalculationDataSource, CalculationFn, ControlValueCalculation, ValidationFn } from '../CalculationDataSource';
import { ValidationDataSource } from '../ValidationDataSource';

export class OrderLotValue implements ControlValueCalculation<number> {
  calculate(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValuesDistinct('orderLotQuantity', 'unitPrice')
      .validatePositiveValue('orderLotQuantity', 'unitPrice')
      .calculate(({ orderLotQuantity, unitPrice }) =>
        orderLotQuantity.value * unitPrice.value
      );
  }

  validate(dataSource: ValidationDataSource): ValidationFn {
    return dataSource
      .mustBePositive()
      .validate();
  }
}
