import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { QuestionService } from '../../service/question.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  userName: any;
  userData: any;
  constructor(private route: Router, public questionService: QuestionService) {}

  ngOnInit() {
    this.getData();
  }

  getData() {
    let data: any = localStorage.getItem('registerUser');
    this.userData = JSON.parse(data);
    let userId: any = this.questionService.getUser();
    this.userName = this.userData?.find(
      (data: any) => data?.id == userId
    )?.fullName;
    console.log(this.userData);
  }
  signout() {
    localStorage.removeItem('isAuthenticate');
    document.cookie = 'userName' + '=' + null;
    this.route.navigateByUrl('/login');
  }
}
