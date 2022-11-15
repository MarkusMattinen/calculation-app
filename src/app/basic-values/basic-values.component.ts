import { isEmpty } from 'lodash-es';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ControlValueCalculator } from '../control-value-calculator/ControlValueCalculator';
import { ControlValueKey } from '../control-value-calculator/ControlValues';

@Component({
  selector: 'app-basic-values',
  templateUrl: './basic-values.component.html',
  styleUrls: ['./basic-values.component.less']
})
export class BasicValuesComponent implements OnInit, OnDestroy {
  @Input() controlValueCalculator: ControlValueCalculator;
  form = this.formBuilder.group({
    unitPrice: [null],
    orderHandlingCost: [null],
    warehousingCostPercentage: [null],
    leadTimeInDays: [null],
  })

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
    this.connectFormControl('unitPrice', 'unitPrice');
    this.connectFormControl('orderHandlingCost', 'orderHandlingCost');
    this.connectFormControl('warehousingCostPercentage', 'warehousingCostPercentage');
    this.connectFormControl('leadTimeInDays', 'leadTimeInDays')
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
