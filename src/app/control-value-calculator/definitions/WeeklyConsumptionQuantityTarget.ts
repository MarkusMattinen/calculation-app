import { CalculationDataSource, CalculationFn, ControlValueCalculation } from '../CalculationDataSource';

export class WeeklyConsumptionQuantityTarget implements ControlValueCalculation<number> {
  calculate(dataSource: CalculationDataSource): CalculationFn {
    return dataSource.tryInOrder(
      dataSource.merge(
        this.calculateFromAnnualTarget(dataSource),
        this.calculateFromDailyTarget(dataSource)
      ),
      this.calculateFromWeeklyTargetValue(dataSource),
    );
  }

  private calculateFromAnnualTarget(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValues('annualConsumptionQuantityTarget', 'daysInYear')
      .onlyWhenAnyExplicitlySet('annualConsumptionQuantityTarget', 'annualConsumptionQuantityTargetValue')
      .validatePositiveValue('daysInYear')
      .calculate(({ annualConsumptionQuantityTarget, daysInYear }) =>
        annualConsumptionQuantityTarget.value / daysInYear.value * 7
      );
  }

  private calculateFromDailyTarget(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValues('dailyConsumptionQuantityTarget')
      .onlyWhenAnyExplicitlySet('dailyConsumptionQuantityTarget', 'dailyConsumptionQuantityTargetValue')
      .calculate(({ dailyConsumptionQuantityTarget }) =>
        dailyConsumptionQuantityTarget.value * 7
      );
  }

  private calculateFromWeeklyTargetValue(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValues('weeklyConsumptionQuantityTargetValue', 'unitPrice')
      .onlyWhenAnyExplicitlySet('weeklyConsumptionQuantityTargetValue')
      .validatePositiveValue('unitPrice')
      .calculate(({ weeklyConsumptionQuantityTargetValue, unitPrice }) =>
        weeklyConsumptionQuantityTargetValue.value / unitPrice.value
      );
  }
}
