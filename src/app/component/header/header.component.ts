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
    this.userName = this.questionService?.userName;
    if (!this.userName) {
      this.getUserData();
    }
  }

  getUserData() {
    let data: any = localStorage.getItem('registerUser');
    this.userName = JSON.parse(data).find((data: any) => {
      return data.id == this.questionService.getUser();
    })?.fullName;
  }

  getUserLetter(userName: string) {
    const intials = userName
    .split(' ')
    .map((name) => name[0])
    .join('')
    .toUpperCase();
  return intials;
}

  signout() {
    localStorage.removeItem('isAuthenticate');
    document.cookie = 'username' + '=' + null;
    this.route.navigateByUrl('/login');
  }
}
