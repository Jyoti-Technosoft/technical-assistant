import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../authorization/auth-guard/auth.guard';
import { DashboardComponent } from '@app/component/dashboard/dashboard.component';
import { Quizcomponent } from '@app/component/quiz/quiz.component';
import { ResultComponent } from '@app/component/result/result.component';
import { StartquizComponent } from '@app/component/startquiz/startquiz.component';
import { FullLayoutComponent } from '@app/layout/full-layout/full-layout.component';
import { AllresultsComponent } from '@app/component/allresults/allresults.component';
import { LoginComponent } from '@app/authorization/login/login.component';
import { RegistrationComponent } from '@app/authorization/registration/registration.component';
import { NonAuthGuard } from '@app/authorization/auth-guard/non-auth.guard';
import { PageNotFoundComponent } from '@app/component/page-not-found/page-not-found.component';

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
      { path: 'allresults', component: AllresultsComponent },
      { path: '**', redirectTo: '404Page', pathMatch: 'full' },
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
      { path: '**', redirectTo: '404Page', pathMatch: 'full' },
    ],
  },
  { path: '404Page', component: PageNotFoundComponent },
  { path: '**', redirectTo: '404Page', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
