import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockValuesComponent } from './stock-values.component';

describe('StockValuesComponent', () => {
  let component: StockValuesComponent;
  let fixture: ComponentFixture<StockValuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockValuesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
