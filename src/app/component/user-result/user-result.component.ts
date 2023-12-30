import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '@app/service/authentication.service';
import { ResultService } from '@app/service/result.service';
import { SnackbarService } from '@app/service/snackbar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-result',
  templateUrl: './user-result.component.html',
  styleUrls: ['./user-result.component.scss']
})
export class UserResultComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  subs: Subscription;

  resultList:any = [];

  isApiCalling = true;

  userId: any;

  isMobileView = false;

  userInfo: any;

  quizImageData:any = {
    'react': 'assets/img/react.svg',
    'angular': 'assets/img/angular.svg',
    'htmlcss': 'assets/img/htmlcss.svg',
    'javascript': 'assets/img/javascript.svg'
  }

  constructor(
    private snackBarService: SnackbarService,
    private resultService: ResultService,
    private auth: AuthenticationService,
    private cd: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
  ) {

    this.subs = new Subscription();
    this.userInfo = localStorage.getItem('selectedUser');
    this.userInfo = JSON.parse(this.userInfo);
  }

  ngOnInit(): void {

    this.userId = this.activatedRoute.snapshot.queryParams['user'];

    this.auth.getScreenSize().subscribe(v => {
      this.isMobileView = v;
      this.cd.detectChanges();
    });

    this.getUserResult();
  }

  getUserResult(): void {

    const getData = this.resultService.getUserResultData(this.userId).subscribe({
      next:(res) => {
        if (res.success) {
          this.resultList = res.data;
        } else {
          this.snackBarService.error(res.message);
        }
        this.isApiCalling = false;
        this.cd?.detectChanges();
      },
      error: (err) => {
        this.snackBarService.error(err.error.message);
        this.isApiCalling = false;
        this.cd?.detectChanges();
      }
    });

    this.subs.add(getData);
  }

  ngOnDestroy(): void {
    localStorage.removeItem('selectedUser');
  }
}
