import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Renderer2, ViewChild } from '@angular/core';
import { OnDestroy, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { DialogService } from '@app/dialog-service/dialog.service';
import dialogData from '@assets/json/dialogData.json';
import { AuthenticationService } from '@app/service/authentication.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { LOCALSTORAGE_KEY } from '@app/utility/utility';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class HeaderComponent implements OnInit, OnDestroy {

  dialogData = { ...dialogData };
  authListenerSubs: Subscription;
  userIsAuthenticated = false;
  @ViewChild('sidenav') sidenav!: MatSidenav;
  menuItem: any = [
    { label: 'Dashboard', icon: 'dashboard', link: '/dashboard' },
    { label: 'All Results', icon: 'pie_chart', link: '/allresults' },
    { label: 'Profile', icon: 'account_circle', link: '/user-profile' },
    { label: 'Sign Out', icon: 'logout', click: () => this.openSignOutDialog(),}
  ];
  reason = '';
  userToken!: boolean;

  constructor(
    private auth: AuthenticationService,
    private dialogService: DialogService,
    private cd: ChangeDetectorRef,
    private router: Router,
  ) {
    this.authListenerSubs = new Subscription;
    this.userToken = JSON.parse(JSON.stringify(localStorage.getItem(LOCALSTORAGE_KEY.TOKEN)));
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
