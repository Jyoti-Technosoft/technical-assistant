import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './authorization/login/login.component';
import { NonauthGuard } from './authorization/nonauth.guard';
import { RegistrationComponent } from './authorization/registration/registration.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [NonauthGuard] },
  { path: 'registration', component: RegistrationComponent },
  {
    path: '',
    loadChildren: () =>
      import('./layout/layout-component.module').then(
        (m) => m.LayoutComponentModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
