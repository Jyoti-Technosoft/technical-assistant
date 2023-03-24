import { NgModule } from "@angular/core";
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { NgbCarouselModule, NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";

import { FooterComponent } from "../component/footer/footer.component";
import { HeaderComponent } from "../component/header/header.component";
import { FullLayoutComponent } from './full-layout/full-layout.component';
import { LayoutRoutingModule } from "./layout-routing.module";
import { DashboardComponent } from "../component/dashboard/dashboard.component";
import { CommonModule } from "@angular/common";
import { StartquizComponent } from "../component/startquiz/startquiz.component";
import { Quizcomponent } from "../component/quiz/quiz.component";
import { ResultComponent } from "../component/result/result.component";
import { AllresultsComponent } from "../component/allresults/allresults.component";



@NgModule({
    declarations: [
        HeaderComponent,
        DashboardComponent,
        FooterComponent,
        StartquizComponent,
        Quizcomponent,
        ResultComponent,
        FullLayoutComponent,
        AllresultsComponent
    ],
    imports:[
        NgbDropdownModule,
        CommonModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        NgbCarouselModule,
        LayoutRoutingModule
    ],
    exports:[
        HeaderComponent,
        FooterComponent,
    ],
})

export class LayoutComponentModule {}