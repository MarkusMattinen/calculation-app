import { CalculationDataSource, CalculationFn, ControlValueCalculation } from '../CalculationDataSource';

export class AnnualConsumptionQuantityTarget implements ControlValueCalculation<number> {
  calculate(dataSource: CalculationDataSource): CalculationFn {
    return dataSource.tryInOrder(
      dataSource.merge(
        this.calculateFromDailyTarget(dataSource),
        this.calculateFromWeeklyTarget(dataSource),
      ),
      this.calculateFromAnnualTargetValue(dataSource),
    );
  }

  private calculateFromDailyTarget(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValues('dailyConsumptionQuantityTarget', 'dailyConsumptionQuantityTargetValue', 'daysInYear')
      .onlyWhenAnyExplicitlySet('dailyConsumptionQuantityTarget', 'dailyConsumptionQuantityTargetValue')
      .validatePositiveValue('daysInYear')
      .calculate(({ dailyConsumptionQuantityTarget, daysInYear }) =>
        dailyConsumptionQuantityTarget.value * daysInYear.value
      );
  }

  private calculateFromWeeklyTarget(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValues('weeklyConsumptionQuantityTarget', 'weeklyConsumptionQuantityTargetValue', 'daysInYear')
      .onlyWhenAnyExplicitlySet('weeklyConsumptionQuantityTarget', 'weeklyConsumptionQuantityTargetValue')
      .validatePositiveValue('daysInYear')
      .calculate(({ weeklyConsumptionQuantityTarget, daysInYear }) =>
        (weeklyConsumptionQuantityTarget.value / 7) * daysInYear.value
      );
  }

  private calculateFromAnnualTargetValue(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValues('annualConsumptionQuantityTargetValue', 'unitPrice')
      .onlyWhenAnyExplicitlySet('annualConsumptionQuantityTargetValue')
      .validatePositiveValue('unitPrice')
      .calculate(({ annualConsumptionQuantityTargetValue, unitPrice }) =>
        annualConsumptionQuantityTargetValue.value / unitPrice.value
      );
  }
}
