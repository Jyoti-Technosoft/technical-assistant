import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { RegistrationComponent } from './authorization/registration/registration.component';
import { LoginComponent } from './authorization/login/login.component';
import { ToastComponent } from './toast/toast.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from './authorization/auth-guard/auth.guard';
import { QuestionService } from './service/question.service';
import { LayoutComponentModule } from './layout/layout-component.module';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({ 
    declarations: [
        AppComponent,
        LoginComponent,
        RegistrationComponent,
        ToastComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        LayoutComponentModule,
        NgbToastModule
    ],
    providers: [AuthGuard,QuestionService],
    bootstrap: [AppComponent],
})
export class AppModule {}
