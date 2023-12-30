import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@app/material/material.module';
import { NgbCarouselModule, NgbDatepickerModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FooterComponent } from '@app/component/footer/footer.component';
import { UserProfileComponent } from '@app/component/user-profile/user-profile.component';

@NgModule({
  declarations: [
    FooterComponent,
    UserProfileComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MaterialModule,
    NgbCarouselModule,
    NgbDatepickerModule,
    NgbDropdownModule,
  ],
  exports: [
    FooterComponent,
    UserProfileComponent,
    CommonModule,
    MaterialModule
  ]
})
export class SharedModule { }
