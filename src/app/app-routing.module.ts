import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './authorization/login/login.component';
import { AuthGuard } from './authorization/auth-guard/auth.guard';
import { PrivacyPolicyComponent } from './component/privacy-policy/privacy-policy.component';
import { TearmsConditionComponent } from './component/tearms-condition/tearms-condition.component';

const routes: Routes = [

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: LoginComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'tearms-condition', component: TearmsConditionComponent },
  {
    path: 'layout',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./layout/layout-component.module').then(
        (m) => m.LayoutComponentModule
      ),
  },
  {
    path: 'admin-layout',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./admin-layout/admin-layout.module').then(
        (m) => m.AdminLayoutModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
