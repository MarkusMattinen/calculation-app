import { ControlValuesComponent } from './control-values/control-values.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'control-values', component: ControlValuesComponent },
  { path: '',   redirectTo: '/control-values', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
