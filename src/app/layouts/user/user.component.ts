import { Component, OnInit } from '@angular/core';
import { BottomNavigationTab } from "nativescript-bottom-navigation";
import {Router} from "@angular/router";
import {Page} from "tns-core-modules/ui/page";

@Component({
  selector: 'ns-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  moduleId: module.id,
})
export class UserComponent implements OnInit {

    public tabs: BottomNavigationTab[] = [
        new BottomNavigationTab('First', 'ic_home'),
        new BottomNavigationTab('Second', 'ic_view_list'),
        new BottomNavigationTab('Third', 'ic_menu')
    ];

  constructor(
      private router: Router,
      private page: Page
  ) {
      this.page.actionBarHidden = true;
      this.page.backgroundSpanUnderStatusBar = true;
      this.page.className = "page-user-layout-container";
      this.page.statusBarStyle = "dark";
  }

  ngOnInit() {
      console.log(this.router.url);
  }
    onBottomNavigationTabSelected(event) {
      console.log(event);
    }
    onBottomNavigationTabPressed(event) {
      console.log(event);
    }
}
