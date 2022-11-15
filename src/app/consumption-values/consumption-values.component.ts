import { isEmpty } from 'lodash-es';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ControlValueCalculator } from '../control-value-calculator/ControlValueCalculator';
import { ControlValueKey } from '../control-value-calculator/ControlValues';

@Component({
  selector: 'app-consumption-values',
  templateUrl: './consumption-values.component.html',
  styleUrls: ['./consumption-values.component.less']
})
export class ConsumptionValuesComponent implements OnInit, OnDestroy {
  @Input() controlValueCalculator: ControlValueCalculator;
  form = this.formBuilder.group({
    dailyConsumptionQuantityTarget: [null],
    dailyConsumptionQuantityTargetValue: [null],
    weeklyConsumptionQuantityTarget: [null],
    weeklyConsumptionQuantityTargetValue: [null],
    annualConsumptionQuantityTarget: [null],
    annualConsumptionQuantityTargetValue: [null],
    leadTimeConsumptionQuantity: [{ value: null, disabled: true }],
    leadTimeConsumptionValue: [{ value: null, disabled: true }],
  });

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
    this.connectFormControl('dailyConsumptionQuantityTarget', 'dailyConsumptionQuantityTarget');
    this.connectFormControl('dailyConsumptionQuantityTargetValue', 'dailyConsumptionQuantityTargetValue');
    this.connectFormControl('weeklyConsumptionQuantityTarget', 'weeklyConsumptionQuantityTarget');
    this.connectFormControl('weeklyConsumptionQuantityTargetValue', 'weeklyConsumptionQuantityTargetValue');
    this.connectFormControl('annualConsumptionQuantityTarget', 'annualConsumptionQuantityTarget');
    this.connectFormControl('annualConsumptionQuantityTargetValue', 'annualConsumptionQuantityTargetValue');
    this.connectFormControl('leadTimeConsumptionQuantity', 'leadTimeConsumptionQuantity');
    this.connectFormControl('leadTimeConsumptionValue', 'leadTimeConsumptionValue');
  }

  private connectFormControl(formControlName: keyof typeof this.form.controls, controlValueName: ControlValueKey) {
    this.form.get(formControlName).valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        const numberValue = Number(`${value}`);
        this.controlValueCalculator.setValue(controlValueName, isFinite(numberValue) ? numberValue : null);
      });

    this.controlValueCalculator.get$(controlValueName)
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ value, errors }) => {
        const formControl = this.form.get(formControlName);
        formControl.setValue(value?.toFixed(0), { emitEvent: false });
        formControl.setErrors(!isEmpty(errors) ? { ...errors } : null);

        if (!isEmpty(errors)) {
          formControl.markAsTouched();
        }
      });
  };
}
