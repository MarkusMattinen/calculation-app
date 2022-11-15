import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlValueFormFieldComponent } from './control-value-form-field.component';

describe('ControlValueFormFieldComponent', () => {
  let component: ControlValueFormFieldComponent;
  let fixture: ComponentFixture<ControlValueFormFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlValueFormFieldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlValueFormFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
