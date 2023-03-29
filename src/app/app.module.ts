import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';

import { AppComponent } from '@app/app.component';
import { RegistrationComponent } from '@app/authorization/registration/registration.component';
import { LoginComponent } from '@app/authorization/login/login.component';
import { ToastComponent } from '@app/toast/toast.component';
import { AppRoutingModule } from '@app/app-routing.module';
import { LayoutComponentModule } from '@app/layout/layout-component.module';
import { ModalComponent } from '@app/dialog-service/modal/modal/modal.component';
import { AuthGuard } from '@app/authorization/auth-guard/auth.guard';
import { AuthenticationService } from '@app/service/authentication.service';

//store module
import { storeModule } from './store/store.module';

import { StoreDevtoolsModule } from '@ngrx/store-devtools';

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
        storeModule ,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        StoreDevtoolsModule.instrument({maxAge:25,logOnly:true}),
        LayoutComponentModule,
        NgbToastModule
    ],
    providers: [AuthGuard,AuthenticationService,CookieService],
    bootstrap: [AppComponent],
})
export class AppModule {}
