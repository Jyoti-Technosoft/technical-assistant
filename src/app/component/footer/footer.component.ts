import { Component, OnInit } from '@angular/core';
import data from "../../../assets/json/dialogData.json";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  socialMedia: {label: string, icon: string, routerlink:string }[] = [
    { label: 'facebook', icon: 'fa fa-facebook', routerlink:"https://www.facebook.com/info.jyotitechnosoft/?ref=py_c" },
    { label: 'twitter', icon: 'fa fa-twitter', routerlink:"https://twitter.com/JyotiTechnosoft" },
    { label: 'instagram', icon: 'fa fa-instagram', routerlink:"https://www.instagram.com/jyoti_technosoft_llp/" },
    { label: 'linkedin', icon: 'fa fa-linkedin', routerlink:"https://in.linkedin.com/company/jyoti-technosoft" }
  ];
  data:any = {...data};
  title: any;
  constructor() {
  }

  ngOnInit() {
    this.title = data?.footer;
    console.log("title  : ", this.title);
  }
}
