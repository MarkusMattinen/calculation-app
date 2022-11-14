import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ControlValueCalculator } from '../control-value-calculator/ControlValueCalculator';
import { ControlValueKey } from '../control-value-calculator/ControlValues';

@Component({
  selector: 'app-consumption-values',
  templateUrl: './consumption-values.component.html',
  styleUrls: ['./consumption-values.component.less']
})
export class ConsumptionValuesComponent implements OnInit, OnDestroy {
  @Input() controlValueCalculator: ControlValueCalculator;
  form?: FormGroup;

  private destroy$ = new Subject();

  constructor(
    private readonly formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
  }

  private buildForm() {
    this.controlValueCalculator.getAll$()
      .pipe(take(1))
      .subscribe((controlValues) => {
        this.form = this.formBuilder.group({
          dailyConsumptionQuantityTarget: [ controlValues.dailyConsumptionQuantityTarget.value ],
          dailyConsumptionQuantityTargetValue: [ controlValues.dailyConsumptionQuantityTargetValue.value ],
          weeklyConsumptionQuantityTarget: [ controlValues.weeklyConsumptionQuantityTarget.value ],
          weeklyConsumptionQuantityTargetValue: [ controlValues.weeklyConsumptionQuantityTargetValue.value ],
          annualConsumptionQuantityTarget: [ controlValues.annualConsumptionQuantityTarget.value ],
          annualConsumptionQuantityTargetValue: [ controlValues.annualConsumptionQuantityTargetValue.value ],
          leadTimeConsumptionQuantity: [{ value: controlValues.leadTimeConsumptionQuantity.value, disabled: true }],
          leadTimeConsumptionValue: [{ value: controlValues.leadTimeConsumptionValue.value, disabled: true }],
        });

        const connectForm = (formControlName: string, controlValueName: ControlValueKey) => {
          this.form?.get(formControlName)?.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
              const numberValue = Number(`${value}`);
              this.controlValueCalculator.setValue(controlValueName, isFinite(numberValue) ? numberValue : null);
            });

          this.form?.get(formControlName)?.setValidators([
            Validators.min(0.001),
            Validators.max(Number.MAX_SAFE_INTEGER)]);

          this.controlValueCalculator.getValue$(controlValueName)
            .pipe(takeUntil(this.destroy$))
            .subscribe((value) =>
              this.form?.get(formControlName)?.setValue(value?.toFixed(0), { emitEvent: false }));
        };

        connectForm('dailyConsumptionQuantityTarget', 'dailyConsumptionQuantityTarget');
        connectForm('dailyConsumptionQuantityTargetValue', 'dailyConsumptionQuantityTargetValue');
        connectForm('weeklyConsumptionQuantityTarget', 'weeklyConsumptionQuantityTarget');
        connectForm('weeklyConsumptionQuantityTargetValue', 'weeklyConsumptionQuantityTargetValue');
        connectForm('annualConsumptionQuantityTarget', 'annualConsumptionQuantityTarget');
        connectForm('annualConsumptionQuantityTargetValue', 'annualConsumptionQuantityTargetValue');
        connectForm('leadTimeConsumptionQuantity', 'leadTimeConsumptionQuantity');
        connectForm('leadTimeConsumptionValue', 'leadTimeConsumptionValue');
      });
  }
}
