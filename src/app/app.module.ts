import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NgbDatepickerModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppComponent } from '@app/app.component';
import { RegistrationComponent } from '@app/authorization/registration/registration.component';
import { LoginComponent } from '@app/authorization/login/login.component';
import { ToastComponent } from '@app/component/toast/toast.component';
import { AppRoutingModule } from '@app/app-routing.module';
import { ModalComponent } from '@app/dialog-service/modal/modal/modal.component';
import { AuthGuard } from '@app/authorization/auth-guard/auth.guard';
import { AuthenticationService } from '@app/service/authentication.service';
//store module
import { storeModule } from '@app/store/store.module';

import { NonAuthGuard } from '@app/authorization/auth-guard/non-auth.guard';
import { RedirectGuard } from '@app/authorization/redirect-guard/redirect.guard';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ModalComponent,
    RegistrationComponent,
    ToastComponent,
  ],
  imports: [
    BrowserModule,
    storeModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: true }),
    NgbToastModule,
    NgbDatepickerModule,
    HttpClientModule
  ],
  providers: [
    AuthGuard,
    NonAuthGuard,
    RedirectGuard,
    AuthenticationService,
    CookieService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
