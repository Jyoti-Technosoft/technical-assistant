import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './authorization/login/login.component';
import { NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistrationComponent } from './authorization/registration/registration.component';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import '@angular/localize'
import '@angular/localize/init';
import { AuthGuard } from './authorization/auth-guard/auth.guard';

import { QuestionService } from './service/question.service';
import { HttpClientModule } from '@angular/common/http';
import { LayoutComponentModule } from './layout/layout-component.module';
import { ToastComponent } from './toast/toast.component';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        RegistrationComponent,
    ],
    providers: [AuthGuard, QuestionService],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        NgbCarouselModule,
        ReactiveFormsModule,
        HttpClientModule,
        LayoutComponentModule,
        NgbToastModule,
    ]
})
export class AppModule { }
