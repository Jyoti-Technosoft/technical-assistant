import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../authorization/auth-guard/auth.guard';
import { DashboardComponent } from '../component/dashboard/dashboard.component';
import { Quizcomponent } from '../component/quiz/quiz.component';
import { ResultComponent } from '../component/result/result.component';
import { FullLayoutComponent } from './full-layout/full-layout.component';
import { AllresultsComponent } from '@app/component/allresults/allresults.component';
import { UserProfileComponent } from '@app/component/user-profile/user-profile.component';
import { PrivacyPolicyComponent } from '@app/component/privacy-policy/privacy-policy.component';
import { TearmsConditionComponent } from '@app/component/tearms-condition/tearms-condition.component';
import { QuizRuleComponent } from '@app/component/quiz-rule/quiz-rule.component';

const routes: Routes = [
  {
    path: '',
    component: FullLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'rules', component: QuizRuleComponent },
      { path: 'quiz', component: Quizcomponent },
      { path: 'result', component: ResultComponent },
      { path: 'allresults', component: AllresultsComponent },
      { path: 'user-profile' ,component: UserProfileComponent},
      { path: 'privacy-policy', component: PrivacyPolicyComponent },
      { path: 'tearms-condition', component: TearmsConditionComponent }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
