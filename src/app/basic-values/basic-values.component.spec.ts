import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicValuesComponent } from './basic-values.component';

describe('BasicValuesComponent', () => {
  let component: BasicValuesComponent;
  let fixture: ComponentFixture<BasicValuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicValuesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
