import { isEmpty } from 'lodash-es';
import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder } from '@angular/forms';
import { ControlValueKey } from '../control-value-calculator/ControlValues';
import { IControlValueCalculator } from '../control-value-calculator/IControlValueCalculator';

@Component({
  selector: 'app-cost-values',
  templateUrl: './cost-values.component.html',
  styleUrls: ['./cost-values.component.less']
})
export class CostValuesComponent implements OnInit {
  @Input() controlValueCalculator: IControlValueCalculator;
  form = this.formBuilder.group({
    labourCost: [{ value: null, disabled: true }],
    totalCost: [{ value: null, disabled: true }],
    unitPriceCostPercentage: [{ value: null, disabled: true }],
    unitPriceWithCosts: [{ value: null, disabled: true }],
    warehousingCost: [{ value: null, disabled: true }],
    incomingStockTransactionQuantityTarget: [{ value: null, disabled: true }],
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
    this.connectFormControl('labourCost', 'labourCost');
    this.connectFormControl('totalCost', 'totalCost');
    this.connectFormControl('unitPriceCostPercentage', 'unitPriceCostPercentage');
    this.connectFormControl('unitPriceWithCosts', 'unitPriceWithCosts');
    this.connectFormControl('warehousingCost', 'warehousingCost');
    this.connectFormControl('incomingStockTransactionQuantityTarget', 'incomingStockTransactionQuantityTarget');
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
