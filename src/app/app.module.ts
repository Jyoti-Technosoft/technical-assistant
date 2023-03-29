import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { RegistrationComponent } from './authorization/registration/registration.component';
import { LoginComponent } from './authorization/login/login.component';
import { ToastComponent } from './toast/toast.component';
import { AppRoutingModule } from './app-routing.module';
import { LayoutComponentModule } from './layout/layout-component.module';
import { ModalComponent } from './dialog-service/modal/modal/modal.component';
import { AuthGuard } from './authorization/auth-guard/auth.guard';
import { AuthenticationService } from './service/authentication.service';

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
    providers: [AuthGuard,AuthenticationService],
    bootstrap: [AppComponent],
})
export class AppModule {}
