import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlValuesComponent } from './control-values.component';

describe('ControlValuesComponent', () => {
  let component: ControlValuesComponent;
  let fixture: ComponentFixture<ControlValuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlValuesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
