import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ControlValuesComponent } from './control-values/control-values.component';
import { StockValuesComponent } from './stock-values/stock-values.component';
import { ConsumptionValuesComponent } from './consumption-values/consumption-values.component';
import { BasicValuesComponent } from './basic-values/basic-values.component';
import { CostValuesComponent } from './cost-values/cost-values.component';


@NgModule({
  declarations: [
    AppComponent,
    ControlValuesComponent,
    StockValuesComponent,
    ConsumptionValuesComponent,
    BasicValuesComponent,
    CostValuesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
