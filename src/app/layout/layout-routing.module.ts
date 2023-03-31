import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../authorization/auth-guard/auth.guard';
import { DashboardComponent } from '../component/dashboard/dashboard.component';
import { Quizcomponent } from '../component/quiz/quiz.component';
import { ResultComponent } from '../component/result/result.component';
import { StartquizComponent } from '../component/startquiz/startquiz.component';
import { FullLayoutComponent } from './full-layout/full-layout.component';
import { AllresultsComponent } from '../component/allresults/allresults.component';
import { LoginComponent } from '@app/authorization/login/login.component';
import { RegistrationComponent } from '@app/authorization/registration/registration.component';
import { NonAuthGuard } from '@app/authorization/auth-guard/non-auth.guard';

const routes: Routes = [
  {
    path: '',
    component: FullLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'quizname', component: StartquizComponent },
      { path: 'quiz', component: Quizcomponent },
      { path: 'result', component: ResultComponent },
      { path: 'allresults', component: AllresultsComponent }
    ],
  },
  {
    path: '',
    component: FullLayoutComponent,
    canActivate: [NonAuthGuard],
    children: [
      { path: '', redirectTo: '/login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent }, // new  module
      { path: 'registration', component: RegistrationComponent }, // new module
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule {}
