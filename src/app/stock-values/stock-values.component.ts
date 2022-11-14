import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ControlValueKey } from '../control-value-calculator/ControlValues';
import { ControlValueCalculator } from '../control-value-calculator/ControlValueCalculator';

@Component({
  selector: 'app-stock-values',
  templateUrl: './stock-values.component.html',
  styleUrls: ['./stock-values.component.less']
})
export class StockValuesComponent implements OnInit {
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
          safetyStockQuantity: [ controlValues.safetyStockQuantity.value ],
          safetyStockInDays: [ controlValues.safetyStockInDays.value ],
          safetyStockValue: [ controlValues.safetyStockValue.value ],
          maximumStockQuantity: [ controlValues.maximumStockQuantity.value ],
          maximumStockInDays: [ controlValues.maximumStockInDays.value ],
          maximumStockValue: [ controlValues.maximumStockValue.value ],
          orderLotQuantity: [ controlValues.orderLotQuantity.value ],
          orderLotInDays: [ controlValues.orderLotInDays.value ],
          orderLotValue: [ controlValues.orderLotValue.value ],
          reorderPointQuantity: [{ value: controlValues.reorderPointQuantity.value, disabled: true }],
          reorderPointInDays: [{ value: controlValues.reorderPointInDays.value, disabled: true }],
          reorderPointValue: [{ value: controlValues.reorderPointValue.value, disabled: true }],
          averageStockInDays: [{ value: controlValues.averageStockInDays.value, disabled: true }],
          averageStockValue: [{ value: controlValues.averageStockValue.value, disabled: true }],
          inventoryTurnoverTarget: [{ value: controlValues.inventoryTurnoverTarget.value, disabled: true }],
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

        connectForm('safetyStockQuantity', 'safetyStockQuantity');
        connectForm('safetyStockInDays', 'safetyStockInDays');
        connectForm('safetyStockValue', 'safetyStockValue');
        connectForm('maximumStockQuantity', 'maximumStockQuantity');
        connectForm('maximumStockInDays', 'maximumStockInDays');
        connectForm('maximumStockValue', 'maximumStockValue');
        connectForm('orderLotQuantity', 'orderLotQuantity');
        connectForm('orderLotInDays', 'orderLotInDays');
        connectForm('orderLotValue', 'orderLotValue');
        connectForm('reorderPointInDays', 'reorderPointInDays');
        connectForm('reorderPointQuantity', 'reorderPointQuantity');
        connectForm('reorderPointValue', 'reorderPointValue');
        connectForm('averageStockInDays', 'averageStockInDays');
        connectForm('averageStockValue', 'averageStockValue');
        connectForm('inventoryTurnoverTarget', 'inventoryTurnoverTarget');
      });
  }
}
