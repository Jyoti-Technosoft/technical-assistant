import { NgModule } from "@angular/core";
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FullLayoutComponent } from '@app/layout/full-layout/full-layout.component';
import { LayoutRoutingModule } from "@app/layout/layout-routing.module";
import { DashboardComponent } from "@app/component/dashboard/dashboard.component";
import { AllresultsComponent } from "@app/component/allresults/allresults.component";
import { Quizcomponent } from "@app/component/quiz/quiz.component";
import { ResultComponent } from "@app/component/result/result.component";
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { SharedModule } from "@app/shared/shared.module";
import { QuizRuleComponent } from "@app/component/quiz-rule/quiz-rule.component";

@NgModule({
    declarations: [
        DashboardComponent,
        Quizcomponent,
        ResultComponent,
        FullLayoutComponent,
        AllresultsComponent,
        QuizRuleComponent,
    ],
    imports:[
        LayoutRoutingModule,
        FormsModule,
        RouterModule,
        NgbModule,
        ReactiveFormsModule,
        SharedModule,
        MonacoEditorModule.forRoot()
    ]
})

export class LayoutComponentModule {}