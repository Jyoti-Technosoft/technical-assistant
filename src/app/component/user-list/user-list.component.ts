import { HttpParams } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { AdminService } from '@app/service/admin.service';
import { AuthenticationService } from '@app/service/authentication.service';
import { SnackbarService } from '@app/service/snackbar.service';
import { Subscription, debounceTime, distinctUntilChanged, startWith } from 'rxjs';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  displayColumns:string[] = ['name', 'email', 'phone', 'gender', 'dob'];

  userList = [];

  subs: Subscription;

  isApiCalling = false;

  userId: number;

  userLength = 0;

  isMobileView = false;

  searchCtrl: FormControl;

  constructor(
    private adminService: AdminService,
    private snackBarService: SnackbarService,
    private auth: AuthenticationService,
    private cd: ChangeDetectorRef,
    public router: Router,
  ) {
    this.subs = new Subscription();
    this.userId = auth.getUserId();
    this.searchCtrl = new FormControl('');
  }

  ngOnInit(): void {

    this.auth.getScreenSize().subscribe(v => {
      this.isMobileView = v;
      this.cd?.detectChanges();
    });

    this.searchCtrl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((searchTerm) => {
        this.paginator.pageIndex = 0;
        if (searchTerm) {
          this.getUserData(this.paginator?.pageIndex, this.paginator?.pageSize, searchTerm);
        } else {
          this.getUserData(this.paginator?.pageIndex, this.paginator?.pageSize);
        }
      });
  }

  ngAfterViewInit(): void {

    if (this.paginator) {
      this.paginator?.page.subscribe((pageEvent) => {
        this.getUserData(pageEvent.pageIndex, pageEvent.pageSize, this.searchCtrl.value);
      });
    }
  }

  getUserData(index: number, pageSize: number, searchVal?: string): void {

    this.isApiCalling = true;
    let params = new HttpParams()
                .set('page', index + 1)
                .set('per_page', pageSize)

    if(!!searchVal) {
      params = params.set('search', searchVal);
    }

    let subData = this.adminService.getAllUserData(params).subscribe({
      next: (res) => {
        this.isApiCalling = false;
        if(res.success) {
          this.userList = res.data;
          this.userLength = res.total;
          this.cd?.detectChanges();
        } else {
          this.snackBarService.error(res.message);
        }
        this.cd?.detectChanges();
      },
      error: (err) => {
        this.isApiCalling = false;
        this.userLength = 0;
        this.snackBarService.error(err.message);
        this.cd?.detectChanges();
      }
    });

    this.subs.add(subData);
  }

  showResults(user: any): void {

    localStorage.setItem('selectedUser', JSON.stringify(user));
    this.router.navigateByUrl(`user-results?user=${user.id}`);
  }
}
