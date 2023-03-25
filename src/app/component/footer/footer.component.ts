import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  icons: { icon: string }[] = [
    { icon: 'facebook' },
    { icon: 'twitter' },
    { icon: 'linkedin' },
    { icon: 'github' },
    { icon: 'instagram' },
  ];

  constructor() {}

  ngOnInit() {}
}
