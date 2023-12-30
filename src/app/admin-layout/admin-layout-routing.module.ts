import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { PrivacyPolicyComponent } from '@app/component/privacy-policy/privacy-policy.component';
import { TearmsConditionComponent } from '@app/component/tearms-condition/tearms-condition.component';
import { RedirectGuard } from '@app/authorization/redirect-guard/redirect.guard';
import { AuthGuard } from '@app/authorization/auth-guard/auth.guard';
import { UserProfileComponent } from '@app/component/user-profile/user-profile.component';
import { UserListComponent } from '@app/component/user-list/user-list.component';
import { UserResultComponent } from '@app/component/user-result/user-result.component';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: '/user-details', pathMatch: 'full' },
      { path: 'user-details', component: UserListComponent },
      { path: 'profile' ,component: UserProfileComponent},
      { path: 'user-results', component: UserResultComponent},      
      {
        path: 'jyoti-web',
        canActivate: [RedirectGuard],
        component: RedirectGuard,
        data: {
          externalUrl: 'https://www.jyotitechnosoft.com/',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminLayoutRoutingModule { }
