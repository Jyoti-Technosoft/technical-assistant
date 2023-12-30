import { NgModule } from "@angular/core";
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminLayoutRoutingModule } from "@app/admin-layout/admin-layout-routing.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SharedModule } from "@app/shared/shared.module";
import { UserListComponent } from "@app/component/user-list/user-list.component";
import { UserResultComponent } from "@app/component/user-result/user-result.component";

@NgModule({
  declarations: [
    AdminDashboardComponent,
    UserListComponent,
    UserResultComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgbModule,
    ReactiveFormsModule,
    AdminLayoutRoutingModule,
    SharedModule
  ]
})
export class AdminLayoutModule { }
