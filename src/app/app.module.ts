import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { LoginComponent } from './authorization/login/login.component';
import { RegistrationComponent } from './authorization/registration/registration.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from './authorization/auth-guard/auth.guard';
import { QuestionService } from './service/question.service';
import { HttpClientModule } from '@angular/common/http';
import { LayoutComponentModule } from './layout/layout-component.module';


@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        RegistrationComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        NgbCarouselModule,
        ReactiveFormsModule,
        HttpClientModule,
        LayoutComponentModule
    ],
    providers: [AuthGuard,QuestionService],
    bootstrap: [AppComponent],
})
export class AppModule {}
