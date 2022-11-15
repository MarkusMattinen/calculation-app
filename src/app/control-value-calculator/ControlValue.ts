type KnownControlValueError = {
  valueIsNull?: string[];
  valueIsNotPositive?: string[];
  valueIsNotPositiveOrZero?: string[];
  mustBePositive?: string;
  mustBePositiveOrZero?: string;
};

type DynamicControlValueError = { [key: string]: any };
export type ControlValueError = KnownControlValueError & DynamicControlValueError;

export type ControlValue<T> = {
  value?: T;
  locked?: boolean;
  editable?: boolean;
  state?: ControlValueState;
  errors?: ControlValueError;
};

export enum ControlValueState {
  // User defined states (can be overridden by calculation results unless locked)
  INITIAL = 0,
  EXPLICITLY_SET = 1,
  // Calculation result states (results with these states are applied to store)
  CALCULATED = 2,
  FAILED = 3,
  // Temporary states (can exist during calculation phase only; results with these states are NOT applied to store)
  SKIPPED = 4,
  UNCHANGED = 5,
}
