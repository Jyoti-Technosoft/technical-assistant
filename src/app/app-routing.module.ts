import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from '@app/authorization/login/login.component';
import { RegistrationComponent } from '@app/authorization/registration/registration.component';
import { NonAuthGuard } from '@app/authorization/auth-guard/non-auth.guard';
import { PageNotFoundComponent } from '@app/component/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [NonAuthGuard] },
  { path: 'registration', component: RegistrationComponent },
  {
    path: '',
    loadChildren: () =>
      import('./layout/layout-component.module').then(
        (m) => m.LayoutComponentModule
      ),
  },
  { path: '**', redirectTo:'404Page',  pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
