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

//store module
import { storeModule } from './store/store.module';

import { StoreDevtoolsModule } from '@ngrx/store-devtools';

@NgModule({ 
    declarations: [
        AppComponent,
        LoginComponent,
        RegistrationComponent,
    ],
    imports: [
        BrowserModule,
        storeModule ,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        StoreDevtoolsModule.instrument({maxAge:25,logOnly:true}),
        LayoutComponentModule
    ],
    providers: [AuthGuard,QuestionService],
    bootstrap: [AppComponent],
})
export class AppModule {}
