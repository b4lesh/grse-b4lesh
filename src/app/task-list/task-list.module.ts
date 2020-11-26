import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskListRoutingModule } from './task-list-routing.module';
import { TaskListComponent } from './task-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [TaskListComponent],
  imports: [
    CommonModule,
    TaskListRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class TaskListModule {}
