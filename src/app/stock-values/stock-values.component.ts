import { isEmpty } from 'lodash-es';
import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder } from '@angular/forms';
import { ControlValueKey } from '../control-value-calculator/ControlValues';
import { IControlValueCalculator } from '../control-value-calculator/IControlValueCalculator';

@Component({
  selector: 'app-stock-values',
  templateUrl: './stock-values.component.html',
  styleUrls: ['./stock-values.component.less']
})
export class StockValuesComponent implements OnInit {
  @Input() controlValueCalculator: IControlValueCalculator;
  form = this.formBuilder.group({
    safetyStockQuantity: [null],
    safetyStockInDays: [null],
    safetyStockValue: [null],
    maximumStockQuantity: [null],
    maximumStockInDays: [null],
    maximumStockValue: [null],
    orderLotQuantity: [null],
    orderLotInDays: [null],
    orderLotValue: [null],
    reorderPointQuantity: [{ value: null, disabled: true }],
    reorderPointInDays: [{ value: null, disabled: true }],
    reorderPointValue: [{ value: null, disabled: true }],
    averageStockInDays: [{ value: null, disabled: true }],
    averageStockValue: [{ value: null, disabled: true }],
    inventoryTurnoverTarget: [{ value: null, disabled: true }],
  });

  private destroy$ = new Subject();

  constructor(
    private readonly formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
  }

  private buildForm() {
    this.connectFormControl('safetyStockQuantity', 'safetyStockQuantity');
    this.connectFormControl('safetyStockInDays', 'safetyStockInDays');
    this.connectFormControl('safetyStockValue', 'safetyStockValue');
    this.connectFormControl('maximumStockQuantity', 'maximumStockQuantity');
    this.connectFormControl('maximumStockInDays', 'maximumStockInDays');
    this.connectFormControl('maximumStockValue', 'maximumStockValue');
    this.connectFormControl('orderLotQuantity', 'orderLotQuantity');
    this.connectFormControl('orderLotInDays', 'orderLotInDays');
    this.connectFormControl('orderLotValue', 'orderLotValue');
    this.connectFormControl('reorderPointInDays', 'reorderPointInDays');
    this.connectFormControl('reorderPointQuantity', 'reorderPointQuantity');
    this.connectFormControl('reorderPointValue', 'reorderPointValue');
    this.connectFormControl('averageStockInDays', 'averageStockInDays');
    this.connectFormControl('averageStockValue', 'averageStockValue');
    this.connectFormControl('inventoryTurnoverTarget', 'inventoryTurnoverTarget');
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
