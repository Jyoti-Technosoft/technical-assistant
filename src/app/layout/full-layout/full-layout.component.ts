import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/service/authentication.service';

@Component({
  selector: 'app-full-layout',
  templateUrl: './full-layout.component.html',
  styleUrls: ['./full-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FullLayoutComponent implements OnInit {

  userData = false;
  constructor(
    private auth: AuthenticationService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.auth.getAuthStatusListener().subscribe(v => {
      this.userData = v;
      this.cd.detectChanges();
    });
  }

}
