import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostValuesComponent } from './cost-values.component';

describe('CostValuesComponent', () => {
  let component: CostValuesComponent;
  let fixture: ComponentFixture<CostValuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostValuesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CostValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
