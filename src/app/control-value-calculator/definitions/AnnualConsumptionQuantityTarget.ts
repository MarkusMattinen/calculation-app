import { CalculationDataSource, CalculationFn, ControlValueCalculation, ValidationFn } from '../CalculationDataSource';
import { ValidationDataSource } from '../ValidationDataSource';

export class AnnualConsumptionQuantityTarget implements ControlValueCalculation<number> {
  calculate(dataSource: CalculationDataSource): CalculationFn {
    return dataSource.merge(
      this.calculateFromDailyTarget(dataSource),
      this.calculateFromWeeklyTarget(dataSource),
      this.calculateFromAnnualTargetValue(dataSource)
    );
  }

  validate(dataSource: ValidationDataSource): ValidationFn {
    return dataSource
      .mustBePositive()
      .validate();
  }

  private calculateFromDailyTarget(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValuesDistinct('dailyConsumptionQuantityTarget', 'daysInYear')
      .onlyWhenAnyExplicitlySet('dailyConsumptionQuantityTarget', 'dailyConsumptionQuantityTargetValue')
      .validatePositiveValue('dailyConsumptionQuantityTarget', 'daysInYear')
      .calculate(({ dailyConsumptionQuantityTarget, daysInYear }) =>
        dailyConsumptionQuantityTarget.value * daysInYear.value
      );
  }

  private calculateFromWeeklyTarget(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValuesDistinct('weeklyConsumptionQuantityTarget', 'daysInYear')
      .onlyWhenAnyExplicitlySet('weeklyConsumptionQuantityTarget', 'weeklyConsumptionQuantityTargetValue')
      .validatePositiveValue('weeklyConsumptionQuantityTarget', 'daysInYear')
      .calculate(({ weeklyConsumptionQuantityTarget, daysInYear }) =>
        (weeklyConsumptionQuantityTarget.value / 7) * daysInYear.value
      );
  }

  private calculateFromAnnualTargetValue(dataSource: CalculationDataSource): CalculationFn {
    return dataSource
      .useValuesDistinct('annualConsumptionQuantityTargetValue', 'unitPrice')
      .onlyWhenAnyExplicitlySet('annualConsumptionQuantityTargetValue')
      .validatePositiveValue('annualConsumptionQuantityTargetValue', 'unitPrice')
      .calculate(({ annualConsumptionQuantityTargetValue, unitPrice }) =>
        annualConsumptionQuantityTargetValue.value / unitPrice.value
      );
  }
}
