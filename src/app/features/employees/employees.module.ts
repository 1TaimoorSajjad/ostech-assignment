import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EmployeesRoutingModule } from './employees-routing.module';
import { EmployeesListComponent } from './components/employees-list/employees-list.component';
import { EmployeeDrawerComponent } from './components/employee-drawer/employee-drawer.component';
import { EmployeeDetailComponent } from './components/employee-detail/employee-detail.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    EmployeesListComponent,
    EmployeeDrawerComponent,
    EmployeeDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    EmployeesRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class EmployeesModule { }
