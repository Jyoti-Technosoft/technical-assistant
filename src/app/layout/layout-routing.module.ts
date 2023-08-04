import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../authorization/auth-guard/auth.guard';
import { DashboardComponent } from '../component/dashboard/dashboard.component';
import { Quizcomponent } from '../component/quiz/quiz.component';
import { ResultComponent } from '../component/result/result.component';
import { rulesComponent } from '../component/startquiz/startquiz.component';
import { FullLayoutComponent } from './full-layout/full-layout.component';
import { AllresultsComponent } from '@app/component/allresults/allresults.component';
import { NonAuthGuard } from '@app/authorization/auth-guard/non-auth.guard';
import { LoginComponent } from '@app/authorization/login/login.component';
import { RegistrationComponent } from '@app/authorization/registration/registration.component';
import { UserProfileComponent } from '@app/component/user-profile/user-profile.component';
import { PrivacyPolicyComponent } from '@app/component/privacy-policy/privacy-policy.component';
import { TearmsConditionComponent } from '@app/component/tearms-condition/tearms-condition.component';

const routes: Routes = [
  {
    path: '',
    component: FullLayoutComponent,
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'quizname', component: rulesComponent, canActivate: [AuthGuard] },
      { path: 'quiz', component: Quizcomponent, canActivate: [AuthGuard] },
      { path: 'result', component: ResultComponent, canActivate: [AuthGuard] },
      { path: 'allresults', component: AllresultsComponent, canActivate: [AuthGuard] },
      { path: 'user-profile' ,component:UserProfileComponent, canActivate: [AuthGuard]},
      { path: 'privacy-policy', component: PrivacyPolicyComponent },
      { path: 'tearms-condition', component: TearmsConditionComponent }
    ],
  },
  {
    path: '',
    component: FullLayoutComponent,
    canActivate: [NonAuthGuard],
    children: [
      { path: '', redirectTo: '/login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent }, // new  module
      { path: 'registration', component: LoginComponent }, // new module
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
