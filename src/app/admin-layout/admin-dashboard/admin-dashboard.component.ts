import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Subscription } from 'rxjs';
import dialogData from '@assets/json/dialogData.json';
import { AuthenticationService } from '@app/service/authentication.service';
import { DialogService } from '@app/dialog-service/dialog.service';
import { SnackbarService } from '@app/service/snackbar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminDashboardComponent {

  dialogData = { ...dialogData };
  authListenerSubs: Subscription;
  userIsAuthenticated = false;
  @ViewChild('sidenav') sidenav!: MatSidenav;
  menuItem: any = [
    { label: 'User', icon: 'supervisor_account', link: '/user-details' },
    { label: 'User Results', icon: 'pie_chart', link: '/user-results' },
    { label: 'Profile', icon: 'account_circle', link: '/profile' },
  ];
  reason = '';
  userToken!: boolean;
  userId: number;
  userData: any;
  avatarName!: string;
  subs: Subscription;

  constructor(
    private auth: AuthenticationService,
    private dialogService: DialogService,
    private snackBarService: SnackbarService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {

    this.authListenerSubs = new Subscription;
    this.subs = new Subscription();
    this.userId = auth.getUserId();
  }

  ngOnInit() {

    this.getUserDetails();
  }

  ngAfterViewInit(): void {

    this.auth.changeFullName$.subscribe(v => {
      if (v) {
        this.getUserDetails();
      }
    });

    this.auth.changeFullName$.next(false);
  }

  getUserDetails(): void {
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
        this.snackBarService.error(err.error.message);
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
              this.snackBarService.success(res.message);
              localStorage.clear();
              this.router.navigateByUrl('login');
              this.cd.detectChanges();
            } else {
              this.snackBarService.error(res.message);
            }
          },
          error: (err) => {
            this.snackBarService.error(err.error.message);
          }
        });
        this.subs.add(logOut);
      }
    });
  }

}
