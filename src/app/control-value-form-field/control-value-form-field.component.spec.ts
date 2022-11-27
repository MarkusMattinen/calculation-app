import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlValueFormFieldComponent } from './control-value-form-field.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

describe('ControlValueFormFieldComponent', () => {
  let component: ControlValueFormFieldComponent;
  let fixture: ComponentFixture<ControlValueFormFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ControlValueFormFieldComponent],
      imports: [ReactiveFormsModule],
    })
      .compileComponents();

    fixture = TestBed.createComponent(ControlValueFormFieldComponent);
    component = fixture.componentInstance;

    component.label = 'Test field';
    component.control = new FormControl();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
