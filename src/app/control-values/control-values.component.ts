import { Component } from '@angular/core';
import { ControlValueCalculator } from '../control-value-calculator/ControlValueCalculator';

@Component({
  selector: 'app-control-values',
  templateUrl: './control-values.component.html',
  styleUrls: ['./control-values.component.less']
})
export class ControlValuesComponent {
  controlValueCalculator = new ControlValueCalculator({
    daysInYear: { value: 365 },
  });
  constructor() {}
}
