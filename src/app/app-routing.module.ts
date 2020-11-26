import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () =>
      import('./home/home.module').then((module) => module.HomeModule),
  },
  {
    path: 'registration',
    loadChildren: () =>
      import('./registration/registration.module').then(
        (module) => module.RegistrationModule
      ),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((module) => module.LoginModule),
  },
  {
    path: 'task-list',
    loadChildren: () =>
      import('./task-list/task-list.module').then(
        (module) => module.TaskListModule
      ),
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
