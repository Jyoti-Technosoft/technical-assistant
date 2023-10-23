import { Component } from '@angular/core';

@Component({
  selector: 'app-tearms-condition',
  templateUrl: './tearms-condition.component.html',
  styleUrls: ['./tearms-condition.component.scss']
})
export class TearmsConditionComponent {

  flag = false;

  constructor() {

    this.flag = !!localStorage.getItem('token') ? true : false;
  }

}
