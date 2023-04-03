import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { RegistrationComponent } from './authorization/registration/registration.component';
import { LoginComponent } from './authorization/login/login.component';
import { ToastComponent } from './component/toast/toast.component';
import { AppRoutingModule } from './app-routing.module';
import { LayoutComponentModule } from './layout/layout-component.module';
import { ModalComponent } from './dialog-service/modal/modal/modal.component';
import { AuthGuard } from './authorization/auth-guard/auth.guard';
import { AuthenticationService } from './service/authentication.service';

@NgModule({ 
    declarations: [
        AppComponent,
        LoginComponent,
        ModalComponent,
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
    providers: [AuthGuard,AuthenticationService],
    bootstrap: [AppComponent],
})
export class AppModule {}
