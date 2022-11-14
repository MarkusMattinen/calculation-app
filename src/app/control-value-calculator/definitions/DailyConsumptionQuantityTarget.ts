import { CalculationDataSource, CalculationFn, ControlValueCalculation } from '../CalculationDataSource';

export class DailyConsumptionQuantityTarget implements ControlValueCalculation<number> {
  calculate(dataSource: CalculationDataSource): CalculationFn {
    return dataSource.tryInOrder(
      dataSource.merge(
        this.calculateFromAnnualTarget(dataSource),
        this.calculateFromWeeklyTarget(dataSource)
      ),
      this.calculateFromDailyTargetValue(dataSource),
    );
  }

  private calculateFromAnnualTarget(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValues('annualConsumptionQuantityTarget', 'annualConsumptionQuantityTargetValue', 'daysInYear')
      .onlyWhenAnyExplicitlySet('annualConsumptionQuantityTarget', 'annualConsumptionQuantityTargetValue')
      .validatePositiveValue('daysInYear')
      .calculate(({ annualConsumptionQuantityTarget, daysInYear }) =>
        annualConsumptionQuantityTarget.value / daysInYear.value
      );
  }

  private calculateFromWeeklyTarget(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValues('weeklyConsumptionQuantityTarget', 'weeklyConsumptionQuantityTargetValue')
      .onlyWhenAnyExplicitlySet('weeklyConsumptionQuantityTarget', 'weeklyConsumptionQuantityTargetValue')
      .calculate(({ weeklyConsumptionQuantityTarget }) =>
        weeklyConsumptionQuantityTarget.value / 7
      );
  }

  private calculateFromDailyTargetValue(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValues('dailyConsumptionQuantityTargetValue', 'unitPrice')
      .onlyWhenAnyExplicitlySet('dailyConsumptionQuantityTargetValue')
      .validatePositiveValue('unitPrice')
      .calculate(({ dailyConsumptionQuantityTargetValue, unitPrice }) =>
        dailyConsumptionQuantityTargetValue.value / unitPrice.value
      );
  }
}
