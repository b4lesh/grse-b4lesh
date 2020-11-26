import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { CommonModule } from '@angular/common';

const routes: Routes = [{ path: '', component: HomeComponent }];

@NgModule({
  declarations: [HomeComponent],
  imports: [RouterModule.forChild(routes), CommonModule],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
