import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tearms-condition',
  templateUrl: './tearms-condition.component.html',
  styleUrls: ['./tearms-condition.component.scss']
})
export class TearmsConditionComponent {

  constructor(private router: Router) {  }

  onExit() {
    this.router.navigate(['/login']);
  }
}
