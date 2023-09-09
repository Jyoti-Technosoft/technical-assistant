import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { OnDestroy, OnInit } from '@angular/core';
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
  userToken!: boolean;
  userData: any;

  constructor(
    private auth: AuthenticationService,
    private dialogService: DialogService,
    private cd: ChangeDetectorRef,
    private router: Router,
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
