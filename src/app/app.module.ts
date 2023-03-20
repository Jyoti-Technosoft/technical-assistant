import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './authorization/login/login.component';
import { RegistrationComponent } from './authorization/registration/registration.component';
import { LayoutComponentModule } from './layout/layout-component.module';
import { AppRoutingModule } from './app-routing.module';

import { AuthGuard } from './authorization/auth-guard/auth.guard';

import { QuestionService } from './service/question.service';

@NgModule({
  declarations: [AppComponent, LoginComponent, RegistrationComponent],
  providers: [AuthGuard, QuestionService],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutComponentModule,
  ],
})
export class AppModule {}
