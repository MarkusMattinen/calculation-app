import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumptionValuesComponent } from './consumption-values.component';

describe('ConsumptionValuesComponent', () => {
  let component: ConsumptionValuesComponent;
  let fixture: ComponentFixture<ConsumptionValuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsumptionValuesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsumptionValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
