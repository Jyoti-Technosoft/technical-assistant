import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { DialogService } from '@app/dialog-service/dialog.service';
import dialogData from '@assets/json/dialogData.json';
import { AuthenticationService } from '@app/service/authentication.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { SnackbarService } from '@app/service/snackbar.service';

@Component({
  selector: 'app-full-layout',
  templateUrl: './full-layout.component.html',
  styleUrls: ['./full-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FullLayoutComponent implements OnInit {

  dialogData = { ...dialogData };
  authListenerSubs: Subscription;
  userIsAuthenticated = false;
  @ViewChild('sidenav') sidenav!: MatSidenav;
  menuItem: any = [
    { label: 'Dashboard', icon: 'dashboard', link: '/dashboard' },
    { label: 'All Results', icon: 'pie_chart', link: '/results' },
    { label: 'Profile', icon: 'account_circle', link: '/user-profile' },
  ];
  reason = '';
  userToken!: boolean;
  userId: number;
  userData: any;
  selected?: string = '';
  avatarName!: string;
  subs: Subscription;

  constructor(
    private auth: AuthenticationService,
    private dialogService: DialogService,
    private snackbarService: SnackbarService,
    private router: Router,
    private snackBarService: SnackbarService,
    private cd: ChangeDetectorRef
  ) {

    this.authListenerSubs = new Subscription;
    this.subs = new Subscription();
    this.userId = auth.getUserId();
  }

  ngOnInit() {

    const userData = this.auth.getUserDetail(this.userId).subscribe({
      next: (res) => {
        if (res.success) {
          this.userData = res.data;
          this.avatarName = this.getUserLetter(this.userData?.name);
          this.cd?.detectChanges();
        } else {
          this.snackBarService.error(res.message);
        }
      },
      error: (err) => {
        this.snackBarService.error(err.message);
      }
    });

    this.subs.add(userData);
  }

  getUserLetter(userName: any) {

    const intials = userName
      .split(' ')
      .map((name: any) => name[0])
      .join('')
      .toUpperCase();
    return intials;
  }

  ngOnDestroy(): void {

    this.authListenerSubs.unsubscribe();
  }

  close(reason: string) {

    this.reason = reason;
    this.sidenav.close();
  }

  openSignOutDialog() {

    let configData = this.dialogData.signoutModel;
    this.dialogService.openDialog(configData).then((value) => {
      if (value) {
        const logOut = this.auth.signOutUser(this.userId).subscribe({
          next: (res) => {
            if (res.success) {
              this.snackbarService.success(res.message);
              localStorage.clear();
              this.router.navigateByUrl('login');
              this.cd.detectChanges();
            } else {
              this.snackbarService.error(res.message);
            }
          },
          error: (err) => {
            this.snackbarService.error(err.message);
          }
        });
        this.subs.add(logOut);
      }
    });
  }

}
