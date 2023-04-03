import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  icons: { icon: string, link:string }[] = [
    { icon: 'facebook', link: "https://www.facebook.com/info.jyotitechnosoft/?ref=py_c"},
    { icon: 'twitter', link: "https://twitter.com/JyotiTechnosoft" },
    { icon: 'linkedin', link: "https://in.linkedin.com/company/jyoti-technosoft" },
    { icon: 'github',  link: "https://github.com/" }
  ];

  constructor() {}

  ngOnInit() {}
}
