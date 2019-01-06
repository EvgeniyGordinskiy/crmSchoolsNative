import { Component, OnInit } from '@angular/core';
import { BottomNavigationTab } from "nativescript-bottom-navigation";

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

  constructor() { }

  ngOnInit() {
  }
    onBottomNavigationTabSelected(event) {
      console.log(event);
    }
    onBottomNavigationTabPressed(event) {
      console.log(event);
    }
}
