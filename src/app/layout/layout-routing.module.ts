import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@app/authorization/auth-guard/auth.guard';
import { DashboardComponent } from '@app/component/dashboard/dashboard.component';
import { Quizcomponent } from '@app/component/quiz/quiz.component';
import { ResultComponent } from '@app/component/result/result.component';
import { StartquizComponent } from '@app/component/startquiz/startquiz.component';
import { FullLayoutComponent } from '@app/layout/full-layout/full-layout.component';

const routes: Routes = [
   { path:'',
     component : FullLayoutComponent,
     canActivate:[AuthGuard],
     children : [
        { path : 'dashboard' , component : DashboardComponent },
        { path: 'quizname', component:StartquizComponent},
        { path: 'quiz', component:Quizcomponent},
        { path: 'result', component:ResultComponent},

     ]
   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
