import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { BasicValuesComponent } from './basic-values.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { IControlValueCalculator } from '../control-value-calculator/IControlValueCalculator';
import { ReplaySubject } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { ControlValueFormFieldComponent } from '../control-value-form-field/control-value-form-field.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HarnessLoader } from '@angular/cdk/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputHarness } from '@angular/material/input/testing';
import { AnyControlValue, ControlValueKey } from '../control-value-calculator/ControlValues';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';

describe('BasicValuesComponent', () => {
  let component: BasicValuesComponent;
  let fixture: ComponentFixture<BasicValuesComponent>;
  let loader: HarnessLoader;

  let subject: ReplaySubject<AnyControlValue>;
  let controlValueCalculatorSpy: jasmine.SpyObj<IControlValueCalculator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [FormBuilder],
      declarations: [BasicValuesComponent, ControlValueFormFieldComponent],
      imports: [ReactiveFormsModule, NoopAnimationsModule, MatCardModule, MatFormFieldModule, MatInputModule],
    })
      .compileComponents();

    // Setup mock for control value calculator
    subject = new ReplaySubject<AnyControlValue>(1);
    controlValueCalculatorSpy = jasmine.createSpyObj<IControlValueCalculator>('ControlValueCalculator',
      ['get$', 'setValue']);
    controlValueCalculatorSpy.get$.and.returnValue(subject.asObservable());

    fixture = TestBed.createComponent(BasicValuesComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    component.controlValueCalculator = controlValueCalculatorSpy;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call setValue with name and value', async () => {
    const formControls = await loader.getAllHarnesses(MatInputHarness);
    expect(formControls.length).toBeGreaterThan(1);

    for (const formControl of formControls) {
      controlValueCalculatorSpy.setValue.calls.reset();
      await formControl.setValue('10');

      // Control value names currently match form control names. If that changes, this will no longer pass
      const name = await formControl.getName();
      expect(controlValueCalculatorSpy.setValue).toHaveBeenCalledWith(name as ControlValueKey, 10);
    }
  });

  it('should update form input contents', async () => {
    const formControls = await loader.getAllHarnesses(MatFormFieldHarness);
    expect(formControls.length).toBeGreaterThan(1);

    for (const formControl of formControls) {
      // Form control should be initially valid and untouched
      expect(await formControl.isControlValid()).toBeTrue();
      expect(await formControl.isControlTouched()).toBeFalse();
      expect(await formControl.isControlDirty()).toBeFalse();

      // Value should be initially empty
      const input = await formControl.getControl(MatInputHarness);
      const value = await input.getValue();
      expect(value).toBe('');
    }

    // Send updated value for all form fields
    subject.next({ value: 20 });

    for (const formControl of formControls) {
      // Form control should still be valid and untouched
      expect(await formControl.isControlValid()).toBeTrue();
      expect(await formControl.isControlTouched()).toBeFalse();
      expect(await formControl.isControlDirty()).toBeFalse();

      // Input field should contain the updated value
      const input = await formControl.getControl(MatInputHarness);
      const value = await input.getValue();
      expect(value).toBe('20');
    }
  });

  it('should set form field to invalid', async () => {
    const formControls = await loader.getAllHarnesses(MatFormFieldHarness);
    expect(formControls.length).toBeGreaterThan(1);

    for (const formControl of formControls) {
      // Form control should be initially valid and untouched
      expect(await formControl.isControlValid()).toBeTrue();
      expect(await formControl.isControlTouched()).toBeFalse();
      expect(await formControl.isControlDirty()).toBeFalse();

      // Value should be initially empty
      const input = await formControl.getControl(MatInputHarness);
      const value = await input.getValue();
      expect(value).toBe('');
    }

    // Send updated value for all form fields
    subject.next({ errors: { someError: ['someErrorDetail'] } });

    for (const formControl of formControls) {
      // After error form control should be invalid and touched
      expect(await formControl.isControlValid()).toBeFalse();
      expect(await formControl.isControlTouched()).toBeTrue();
      expect(await formControl.isControlDirty()).toBeFalse();

      // Value should still be empty
      const input = await formControl.getControl(MatInputHarness);
      const value = await input.getValue();
      expect(value).toBe('');
    }
  });
});
