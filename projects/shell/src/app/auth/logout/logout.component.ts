import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LocalStorageUtil } from 'common/base/utils';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
})
export class LogoutComponent implements OnInit {
  constructor( private location: Location) {}

  ngOnInit() {
    LocalStorageUtil.logOut();
  }
}
