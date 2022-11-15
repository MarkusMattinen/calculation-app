import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-control-value-form-field',
  templateUrl: './control-value-form-field.component.html',
  styleUrls: ['./control-value-form-field.component.less']
})
export class ControlValueFormFieldComponent {
  @Input() label: string;
  @Input() control: FormControl;

  constructor() {}
}
