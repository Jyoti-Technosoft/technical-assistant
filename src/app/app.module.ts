import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule  } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from '@app/app.component';
import { LoginComponent } from '@app/authorization/login/login.component';
import { AppRoutingModule } from '@app/app-routing.module';
import { LayoutComponentModule } from '@app/layout/layout-component.module';
import { ModalComponent } from '@app/dialog-service/modal/modal/modal.component';
import { AuthGuard } from '@app/authorization/auth-guard/auth.guard';
import { AuthenticationService } from '@app/service/authentication.service';
import { MaterialModule } from '@app/material/material.module';
import { NonAuthGuard } from '@app/authorization/auth-guard/non-auth.guard';
import { RedirectGuard } from '@app/authorization/redirect-guard/redirect.guard';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { PrivacyPolicyComponent } from './component/privacy-policy/privacy-policy.component';
import { TearmsConditionComponent } from './component/tearms-condition/tearms-condition.component';
import { QuizRuleComponent } from './component/quiz-rule/quiz-rule.component';
import { AuthInterceptor } from './auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ModalComponent,
    PrivacyPolicyComponent,
    TearmsConditionComponent,
    QuizRuleComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutComponentModule,
    NgbToastModule,
    NgbDatepickerModule,
    HttpClientModule
  ],
  providers: [
    AuthGuard,
    NonAuthGuard,
    RedirectGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
