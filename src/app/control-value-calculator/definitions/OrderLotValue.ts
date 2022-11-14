import { CalculationDataSource, CalculationFn, ControlValueCalculation } from '../CalculationDataSource';

export class OrderLotValue implements ControlValueCalculation<number> {
  calculate(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValues('orderLotQuantity', 'unitPrice')
      .calculate(({ orderLotQuantity, unitPrice }) =>
        orderLotQuantity.value * unitPrice.value
      );
  }
}
