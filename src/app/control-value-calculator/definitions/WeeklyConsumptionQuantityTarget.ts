import { CalculationDataSource, CalculationFn, ControlValueCalculation, ValidationFn } from '../CalculationDataSource';
import { ValidationDataSource } from '../ValidationDataSource';

export class WeeklyConsumptionQuantityTarget implements ControlValueCalculation<number> {
  calculate(dataSource: CalculationDataSource): CalculationFn {
    return dataSource.merge(
      this.calculateFromDailyTarget(dataSource),
      this.calculateFromAnnualTarget(dataSource),
      this.calculateFromWeeklyTargetValue(dataSource)
    );
  }

  validate(dataSource: ValidationDataSource): ValidationFn {
    return dataSource
      .mustBePositive()
      .validate();
  }

  private calculateFromAnnualTarget(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValuesDistinct('annualConsumptionQuantityTarget', 'daysInYear')
      .onlyWhenAnyExplicitlySet('annualConsumptionQuantityTarget', 'annualConsumptionQuantityTargetValue')
      .validatePositiveValue('annualConsumptionQuantityTarget', 'daysInYear')
      .calculate(({ annualConsumptionQuantityTarget, daysInYear }) =>
        annualConsumptionQuantityTarget.value / daysInYear.value * 7
      );
  }

  private calculateFromDailyTarget(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValuesDistinct('dailyConsumptionQuantityTarget')
      .onlyWhenAnyExplicitlySet('dailyConsumptionQuantityTarget', 'dailyConsumptionQuantityTargetValue')
      .validatePositiveValue('dailyConsumptionQuantityTarget')
      .calculate(({ dailyConsumptionQuantityTarget }) =>
        dailyConsumptionQuantityTarget.value * 7
      );
  }

  private calculateFromWeeklyTargetValue(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValuesDistinct('weeklyConsumptionQuantityTargetValue', 'unitPrice')
      .onlyWhenAnyExplicitlySet('weeklyConsumptionQuantityTargetValue')
      .validatePositiveValue('weeklyConsumptionQuantityTargetValue', 'unitPrice')
      .calculate(({ weeklyConsumptionQuantityTargetValue, unitPrice }) =>
        weeklyConsumptionQuantityTargetValue.value / unitPrice.value
      );
  }
}
