import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthService } from '../authorization/auth-guard/auth.service';
import { DashboardComponent } from '../component/dashboard/dashboard.component';
import { Quizcomponent } from '../component/quiz/quiz.component';
import { ResultComponent } from '../component/result/result.component';
import { StartquizComponent } from '../component/startquiz/startquiz.component';
import { AllresultsComponent } from '../component/allresults/allresults.component';
import { FullLayoutComponent } from './full-layout/full-layout.component';

const routes: Routes = [
   { path:'',
     component : FullLayoutComponent,
     canActivate:[AuthService],
     children : [
        { path : 'dashboard' , component : DashboardComponent },
        { path: 'quizname', component:StartquizComponent},
        { path: 'quiz', component:Quizcomponent},
        { path: 'result', component:ResultComponent},
        { path: 'allresults', component:AllresultsComponent }
     ]
   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
