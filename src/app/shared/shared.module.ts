import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './components/loading/loading.component';
import { ErrorBlockComponent } from './components/error-block/error-block.component';
import { MaterialModule } from './material/material.module';

@NgModule({
  declarations: [
    LoadingComponent,
    ErrorBlockComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    LoadingComponent,
    ErrorBlockComponent,
    MaterialModule
  ]
})
export class SharedModule { }
