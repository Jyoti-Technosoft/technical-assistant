import { Component } from '@angular/core';

interface menuItem { label:string, icon: string, link?:string }

@Component({
  selector: 'app-full-layout',
  templateUrl: './full-layout.component.html',
  styleUrls: ['./full-layout.component.scss']
})
export class FullLayoutComponent {

  menuItem: menuItem[] = [
    { label: 'Dashboard', icon: 'fa-home', link: 'dashboard' },
    { label: 'All Results', icon: 'fa-th-large', link: 'allresults' },
    { label: 'Profile', icon: 'fa-user', link: 'Profile' },
    { label: 'Sign Out', icon: 'fa-sign-out' }
  ]
  
}
