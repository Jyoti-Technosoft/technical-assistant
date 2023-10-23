import { Component } from '@angular/core';
@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent{

  flag = false;

  constructor() {

    this.flag = !!localStorage.getItem('token') ? true : false;
  }
}
