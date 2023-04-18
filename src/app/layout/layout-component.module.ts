import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbCarouselModule, NgbDatepickerModule, NgbDropdownModule, NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { FooterComponent } from "@app/component/footer/footer.component";
import { HeaderComponent } from "@app/component/header/header.component";
import { FullLayoutComponent } from '@app/layout/full-layout/full-layout.component';
import { LayoutRoutingModule } from "@app/layout/layout-routing.module";
import { DashboardComponent } from "@app/component/dashboard/dashboard.component";
import { CommonModule } from "@angular/common";
import { AllresultsComponent } from "@app/component/allresults/allresults.component";
import { StartquizComponent } from "@app/component/startquiz/startquiz.component";
import { Quizcomponent } from "@app/component/quiz/quiz.component";
import { ResultComponent } from "@app/component/result/result.component";
import { FilterPipe } from '@app/component/pipe/filter.pipe';
import { AdminDashboardComponent } from '@app/component/admin-dashboard/admin-dashboard.component';
import { AddQuizComponent } from '@app/component/add-quiz/add-quiz.component';
import { AddQuestionModalComponent } from '@app/dialog-service/modal/modal/add-question-modal/add-question-modal.component';

@NgModule({
    declarations: [
        HeaderComponent,
        DashboardComponent,
        FooterComponent,
        StartquizComponent,
        Quizcomponent,
        ResultComponent,
        AdminDashboardComponent,
        FullLayoutComponent,
        AddQuestionModalComponent,
        AddQuizComponent,
        AllresultsComponent,
        FilterPipe
    ],
    imports:[
        NgbDropdownModule,
        CommonModule,
        FormsModule,
        RouterModule,
        NgbModule, 
        ReactiveFormsModule,
        NgbCarouselModule,
        LayoutRoutingModule,
        NgbDatepickerModule
    ],
    exports:[
        HeaderComponent,
        FooterComponent,
        FilterPipe
    ],
})
export class LayoutComponentModule {}
