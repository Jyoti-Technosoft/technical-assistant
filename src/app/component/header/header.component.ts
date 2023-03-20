import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { QuestionService } from '../../service/question.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  userName: any;
  userData: any;
  constructor(private route: Router, public questionService: QuestionService) {}

  ngOnInit() {
    this.userName = this.questionService?.userName;
    if (!this.userName) {
      this.getData();
    }
  }

  getData() {
    let data: any = localStorage.getItem('registerUser');
    this.userData = JSON.parse(data);
    let userId: any = this.questionService.getUser();
    this.userName = this.userData?.find(
      (data: any) => data?.id == userId
    )?.fullname;
  }
  signout() {
    localStorage.removeItem('isAuthenticate');
    document.cookie = 'username' + '=' + null;
    this.route.navigateByUrl('/login');
  }
}
