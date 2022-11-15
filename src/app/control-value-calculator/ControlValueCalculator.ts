import { WarehousingCostPercentage } from './definitions/WarehousingCostPercentage';
import { OrderHandlingCost } from './definitions/OrderHandlingCost';
import { LeadTimeInDays } from './definitions/LeadTimeInDays';
import { DaysInYear } from './definitions/DaysInYear';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { cloneDeep, isEqual } from 'lodash-es';
import { ControlValue } from './ControlValue';
import { ControlValueKey, ControlValueKeyOfType, ControlValues } from './ControlValues';
import { ControlValueStore } from './ControlValueStore';

import { AnnualConsumptionQuantityTarget } from './definitions/AnnualConsumptionQuantityTarget';
import { AnnualConsumptionQuantityTargetValue } from './definitions/AnnualConsumptionQuantityTargetValue';
import { AverageStockInDays } from './definitions/AverageStockInDays';
import { AverageStockValue } from './definitions/AverageStockValue';
import { DailyConsumptionQuantityTarget } from './definitions/DailyConsumptionQuantityTarget';
import { DailyConsumptionQuantityTargetValue } from './definitions/DailyConsumptionQuantityTargetValue';
import { IncomingStockTransactionQuantityTarget } from './definitions/IncomingStockTransactionQuantityTarget';
import { InventoryTurnoverTarget } from './definitions/InventoryTurnoverTarget';
import { LabourCost } from './definitions/LabourCost';
import { LeadTimeConsumptionQuantity } from './definitions/LeadTimeConsumptionQuantity';
import { LeadTimeConsumptionValue } from './definitions/LeadTimeConsumptionValue';
import { MaximumStockInDays } from './definitions/MaximumStockInDays';
import { MaximumStockQuantity } from './definitions/MaximumStockQuantity';
import { MaximumStockValue } from './definitions/MaximumStockValue';
import { OrderLotInDays } from './definitions/OrderLotInDays';
import { OrderLotQuantity } from './definitions/OrderLotQuantity';
import { OrderLotValue } from './definitions/OrderLotValue';
import { ReorderPointInDays } from './definitions/ReorderPointInDays';
import { ReorderPointQuantity } from './definitions/ReorderPointQuantity';
import { ReorderPointValue } from './definitions/ReorderPointValue';
import { SafetyStockInDays } from './definitions/SafetyStockInDays';
import { SafetyStockQuantity } from './definitions/SafetyStockQuantity';
import { SafetyStockValue } from './definitions/SafetyStockValue';
import { TotalCost } from './definitions/TotalCost';
import { UnitPriceCostPercentage } from './definitions/UnitPriceCostPercentage';
import { UnitPriceWithCosts } from './definitions/UnitPriceWithCosts';
import { WarehousingCost } from './definitions/WarehousingCost';
import { WeeklyConsumptionQuantityTarget } from './definitions/WeeklyConsumptionQuantityTarget';
import { WeeklyConsumptionQuantityTargetValue } from './definitions/WeeklyConsumptionQuantityTargetValue';
import { UnitPrice } from './definitions/UnitPrice';

/**
 * Main public entrypoint to the control value store and calculations.
 */
export class ControlValueCalculator {
  private store: ControlValueStore;

  constructor(initialControlValues?: Partial<ControlValues>) {
    this.store = new ControlValueStore();
    this.store.init(initialControlValues);
    this.store.addCalculation('annualConsumptionQuantityTarget', new AnnualConsumptionQuantityTarget());
    this.store.addCalculation('annualConsumptionQuantityTargetValue', new AnnualConsumptionQuantityTargetValue());
    this.store.addCalculation('averageStockInDays', new AverageStockInDays());
    this.store.addCalculation('averageStockValue', new AverageStockValue());
    this.store.addCalculation('dailyConsumptionQuantityTarget', new DailyConsumptionQuantityTarget());
    this.store.addCalculation('dailyConsumptionQuantityTargetValue', new DailyConsumptionQuantityTargetValue());
    this.store.addCalculation('daysInYear', new DaysInYear());
    this.store.addCalculation('incomingStockTransactionQuantityTarget', new IncomingStockTransactionQuantityTarget());
    this.store.addCalculation('inventoryTurnoverTarget', new InventoryTurnoverTarget());
    this.store.addCalculation('labourCost', new LabourCost());
    this.store.addCalculation('leadTimeConsumptionQuantity', new LeadTimeConsumptionQuantity());
    this.store.addCalculation('leadTimeConsumptionValue', new LeadTimeConsumptionValue());
    this.store.addCalculation('leadTimeInDays', new LeadTimeInDays());
    this.store.addCalculation('maximumStockInDays', new MaximumStockInDays());
    this.store.addCalculation('maximumStockQuantity', new MaximumStockQuantity());
    this.store.addCalculation('maximumStockValue', new MaximumStockValue());
    this.store.addCalculation('orderHandlingCost', new OrderHandlingCost());
    this.store.addCalculation('orderLotInDays', new OrderLotInDays());
    this.store.addCalculation('orderLotQuantity', new OrderLotQuantity());
    this.store.addCalculation('orderLotValue', new OrderLotValue());
    this.store.addCalculation('reorderPointInDays', new ReorderPointInDays());
    this.store.addCalculation('reorderPointQuantity', new ReorderPointQuantity());
    this.store.addCalculation('reorderPointValue', new ReorderPointValue());
    this.store.addCalculation('safetyStockInDays', new SafetyStockInDays());
    this.store.addCalculation('safetyStockQuantity', new SafetyStockQuantity());
    this.store.addCalculation('safetyStockValue', new SafetyStockValue());
    this.store.addCalculation('totalCost', new TotalCost());
    this.store.addCalculation('unitPrice', new UnitPrice());
    this.store.addCalculation('unitPriceCostPercentage', new UnitPriceCostPercentage());
    this.store.addCalculation('unitPriceWithCosts', new UnitPriceWithCosts());
    this.store.addCalculation('warehousingCost', new WarehousingCost());
    this.store.addCalculation('warehousingCostPercentage', new WarehousingCostPercentage());
    this.store.addCalculation('weeklyConsumptionQuantityTarget', new WeeklyConsumptionQuantityTarget());
    this.store.addCalculation('weeklyConsumptionQuantityTargetValue', new WeeklyConsumptionQuantityTargetValue());
  }

  /**
   * Set initial control values
   */
  init(initialControlValues: Partial<ControlValues>) {
    this.store.init(initialControlValues);
  }

  /**
   * Get the whole control value store state
   */
  getAll(): ControlValues {
    return cloneDeep(this.store.controlValues);
  }

  /**
   * Get an observable of the whole control value store state
   */
  getAll$(): Observable<ControlValues> {
    return this.store.controlValues$.pipe(
      map((controlValues) => cloneDeep(controlValues))
    );
  }

  /**
   * Get a single control value
   */
  get<K extends ControlValueKey>(key: K): ControlValues[K] {
    return cloneDeep(this.store.controlValues[key]);
  }

  /**
   * Get an observable of a single control value
   */
  get$<K extends ControlValueKey>(key: K): Observable<ControlValues[K]> {
    return this.store.controlValues$.pipe(
      map((controlValues) => cloneDeep(controlValues[key])),
      distinctUntilChanged(isEqual)
    );
  }

  /**
   * Get the value of a single control value
   */
  getValue<K extends ControlValueKey>(key: K): ControlValues[K]['value'] {
    return this.store.controlValues[key].value;
  }

  /**
   * Get an observable of the value of a single control value
   */
  getValue$<K extends ControlValueKey>(key: K): Observable<ControlValues[K]['value']> {
    return this.store.controlValues$.pipe(
      map((controlValues) => controlValues[key].value),
      distinctUntilChanged(isEqual)
    );
  }

  /**
   * Get an observable of the editable state of a single control value
   */
  isEditable<K extends ControlValueKey>(key: K): boolean {
    return this.store.controlValues[key].editable;
  }

  /**
   * Get an observable of the editable state of a single control value
   */
  isEditable$<K extends ControlValueKey>(key: K): Observable<boolean> {
    return this.store.controlValues$.pipe(
      map((controlValues) => controlValues[key].editable),
      distinctUntilChanged()
    );
  }

  /**
   * Set multiple control values
   */
  patch(controlValues: Partial<ControlValues>): void {
    this.store.patch(controlValues);
  }

  /**
   * Set a single control value
   */
  set<V, K extends ControlValueKeyOfType<V>>(key: K, controlValue: ControlValue<V>): void {
    this.store.set(key, controlValue);
  }

  /**
   * Set the value of a single control value
   */
  setValue<V, K extends ControlValueKeyOfType<V>>(key: K, value: V): void {
    this.store.setValue(key, value);
  }

  /**
   * Set the locked state of a single control value
   */
  setLocked<V, K extends ControlValueKeyOfType<V>>(key: K, locked: boolean): void {
    this.store.setLocked(key, locked);
  }
}
