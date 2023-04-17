import { NgModule } from "@angular/core";
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

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
import { HoverDirective } from '@app/directive/hover.directive';



@NgModule({
    declarations: [
        HeaderComponent,
        DashboardComponent,
        FooterComponent,
        StartquizComponent,
        Quizcomponent,
        ResultComponent,
        FullLayoutComponent,
        AllresultsComponent,
        HoverDirective
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
    ],
})

export class LayoutComponentModule {}