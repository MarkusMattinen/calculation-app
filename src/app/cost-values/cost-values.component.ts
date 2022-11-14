import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ControlValueKey } from '../control-value-calculator/ControlValues';
import { ControlValueCalculator } from '../control-value-calculator/ControlValueCalculator';

@Component({
  selector: 'app-cost-values',
  templateUrl: './cost-values.component.html',
  styleUrls: ['./cost-values.component.less']
})
export class CostValuesComponent implements OnInit {
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
          labourCost: [{ value: controlValues.labourCost.value, disabled: true }],
          totalCost: [{ value: controlValues.totalCost.value, disabled: true }],
          unitPriceCostPercentage: [{ value: controlValues.unitPriceCostPercentage.value, disabled: true }],
          unitPriceWithCosts: [{ value: controlValues.unitPriceWithCosts.value, disabled: true }],
          warehousingCost: [{ value: controlValues.warehousingCost.value, disabled: true }],
          incomingStockTransactionQuantityTarget: [{ value: controlValues.incomingStockTransactionQuantityTarget.value, disabled: true }],
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

        connectForm('labourCost', 'labourCost');
        connectForm('totalCost', 'totalCost');
        connectForm('unitPriceCostPercentage', 'unitPriceCostPercentage');
        connectForm('unitPriceWithCosts', 'unitPriceWithCosts');
        connectForm('warehousingCost', 'warehousingCost');
        connectForm('incomingStockTransactionQuantityTarget', 'incomingStockTransactionQuantityTarget');
      });
  }
}
