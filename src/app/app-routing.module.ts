import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './authorization/login/login.component';
import { RegistrationComponent } from './authorization/registration/registration.component';
import { AuthGuard } from './authorization/auth-guard/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'userregistration', component: RegistrationComponent },
  {
    path: '',
    loadChildren: () =>
      import('./layout/layout-component.module').then(
        (m) => m.LayoutComponentModule
      ),
  },
  {path:"**",redirectTo:'/login',pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
