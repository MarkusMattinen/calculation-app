import { ControlValue, ControlValueState } from './ControlValue';

export type ControlValues = {
  annualConsumptionQuantityTarget: ControlValue<number>;
  annualConsumptionQuantityTargetValue: ControlValue<number>;
  averageStockInDays: ControlValue<number>;
  averageStockValue: ControlValue<number>;
  dailyConsumptionQuantityTarget: ControlValue<number>;
  dailyConsumptionQuantityTargetValue: ControlValue<number>;
  daysInYear: ControlValue<number>;
  incomingStockTransactionQuantityTarget: ControlValue<number>;
  inventoryTurnoverTarget: ControlValue<number>;
  labourCost: ControlValue<number>;
  leadTimeConsumptionQuantity: ControlValue<number>;
  leadTimeConsumptionValue: ControlValue<number>;
  leadTimeInDays: ControlValue<number>;
  maximumStockInDays: ControlValue<number>;
  maximumStockQuantity: ControlValue<number>;
  maximumStockValue: ControlValue<number>;
  orderHandlingCost: ControlValue<number>;
  orderLotInDays: ControlValue<number>;
  orderLotQuantity: ControlValue<number>;
  orderLotValue: ControlValue<number>;
  reorderPointInDays: ControlValue<number>;
  reorderPointQuantity: ControlValue<number>;
  reorderPointValue: ControlValue<number>;
  safetyStockInDays: ControlValue<number>;
  safetyStockQuantity: ControlValue<number>;
  safetyStockValue: ControlValue<number>;
  totalCost: ControlValue<number>;
  unitPrice: ControlValue<number>;
  unitPriceCostPercentage: ControlValue<number>;
  unitPriceWithCosts: ControlValue<number>;
  warehousingCost: ControlValue<number>;
  warehousingCostPercentage: ControlValue<number>;
  weeklyConsumptionQuantityTarget: ControlValue<number>;
  weeklyConsumptionQuantityTargetValue: ControlValue<number>;
};

export const defaultControlValues: ControlValues = {
  annualConsumptionQuantityTarget: null,
  annualConsumptionQuantityTargetValue: null,
  averageStockInDays: null,
  averageStockValue: null,
  dailyConsumptionQuantityTarget: null,
  dailyConsumptionQuantityTargetValue: null,
  daysInYear: null,
  incomingStockTransactionQuantityTarget: null,
  inventoryTurnoverTarget: null,
  labourCost: null,
  leadTimeConsumptionQuantity: null,
  leadTimeConsumptionValue: null,
  leadTimeInDays: null,
  maximumStockInDays: null,
  maximumStockQuantity: null,
  maximumStockValue: null,
  orderHandlingCost: null,
  orderLotInDays: null,
  orderLotQuantity: null,
  orderLotValue: null,
  reorderPointInDays: null,
  reorderPointQuantity: null,
  reorderPointValue: null,
  safetyStockInDays: null,
  safetyStockQuantity: null,
  safetyStockValue: null,
  totalCost: null,
  unitPrice: null,
  unitPriceCostPercentage: null,
  unitPriceWithCosts: null,
  warehousingCost: null,
  warehousingCostPercentage: null,
  weeklyConsumptionQuantityTarget: null,
  weeklyConsumptionQuantityTargetValue: null,
};

type KeyOfType<O, T> = {
  [K in keyof O]: O[K] extends T ? K : never
}[keyof O];
export type ControlValueKey = keyof ControlValues;
export type ControlValueKeyOfType<V> = KeyOfType<ControlValues, ControlValue<V>>;
export type AnyControlValue = ControlValues[ControlValueKey];
export type AnyControlValueValue = AnyControlValue['value'];
export type ControlValueLocks = {
  [K in keyof ControlValues as `${K}Locked`]: boolean
};
export type ControlValueLockKey = keyof ControlValueLocks;

// Overload to support wrapping both complete and partial control value sets
export function wrapNullValues(controlValues: ControlValues): ControlValues;
export function wrapNullValues(controlValues: Partial<ControlValues>): Partial<ControlValues>;
export function wrapNullValues(controlValues: ControlValues): ControlValues {
  for (const key of Object.keys(controlValues)) {
    if (!controlValues[key]) {
      controlValues[key] = {
        value: null,
        locked: false,
        editable: true,
        errors: [],
        state: ControlValueState.INITIAL
      };
    }
  }

  return controlValues;
}

