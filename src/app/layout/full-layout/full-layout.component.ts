import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { DialogService } from '@app/dialog-service/dialog.service';
import dialogData from '@assets/json/dialogData.json';
import { AuthenticationService } from '@app/service/authentication.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { LOCALSTORAGE_KEY } from '@app/utility/utility';

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
    { label: 'All Results', icon: 'pie_chart', link: '/allresults' },
    { label: 'Profile', icon: 'account_circle', link: '/user-profile' },
    { label: 'Sign Out', icon: 'logout', link: '/login', click: () => this.openSignOutDialog() }
  ];
  reason = '';
  userToken!: boolean;
  userData: any;
  selected?: string = '';

  constructor(
    private auth: AuthenticationService,
    private dialogService: DialogService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {
    this.authListenerSubs = new Subscription;
    this.userToken = JSON.parse(JSON.stringify(localStorage.getItem(LOCALSTORAGE_KEY.TOKEN)));
    this.userData = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY.USERDATA) as string);
  }

  ngOnInit() {

    this.authListenerSubs = this.auth.getAuthStatusListener().subscribe(v => {
      this.userIsAuthenticated = v;
      this.cd.detectChanges();
    });
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
        this.auth.authStatusListener$.next(false);
        localStorage.clear();
        localStorage.setItem(LOCALSTORAGE_KEY.TOKEN, JSON.stringify(false));
        this.router.navigateByUrl('login');
      }
    });
  }

}
