import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LocalStorageUtil } from 'common/base/utils';
import { AutService } from 'share';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
})
export class LogoutComponent implements OnInit {
  constructor(private autService: AutService, private location: Location) {}

  ngOnInit() {
    LocalStorageUtil.logOut();
    location.href = this.autService.logoutVneid(
      window.location.origin +
        this.location.prepareExternalUrl('/auth/login-vneid')
    );
  }
}
