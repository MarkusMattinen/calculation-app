import { CalculationDataSource, CalculationFn, ControlValueCalculation, ValidationFn } from '../CalculationDataSource';
import { ValidationDataSource } from '../ValidationDataSource';

export class DailyConsumptionQuantityTarget implements ControlValueCalculation<number> {
  calculate(dataSource: CalculationDataSource): CalculationFn {
    return dataSource.merge(
      this.calculateFromAnnualTarget(dataSource),
      this.calculateFromWeeklyTarget(dataSource),
      this.calculateFromDailyTargetValue(dataSource)
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
        annualConsumptionQuantityTarget.value / daysInYear.value
      );
  }

  private calculateFromWeeklyTarget(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValuesDistinct('weeklyConsumptionQuantityTarget')
      .onlyWhenAnyExplicitlySet('weeklyConsumptionQuantityTarget', 'weeklyConsumptionQuantityTargetValue')
      .validatePositiveValue('weeklyConsumptionQuantityTarget')
      .calculate(({ weeklyConsumptionQuantityTarget }) =>
        weeklyConsumptionQuantityTarget.value / 7
      );
  }

  private calculateFromDailyTargetValue(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValuesDistinct('dailyConsumptionQuantityTargetValue', 'unitPrice')
      .onlyWhenAnyExplicitlySet('dailyConsumptionQuantityTargetValue')
      .validatePositiveValue('dailyConsumptionQuantityTargetValue', 'unitPrice')
      .calculate(({ dailyConsumptionQuantityTargetValue, unitPrice }) =>
        dailyConsumptionQuantityTargetValue.value / unitPrice.value
      );
  }
}
