import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageUtil, ACCESS_TOKEN_KEY } from 'common/base/utils';
import { AutService } from 'common/share/src/service/application/auth/aut.service';
import { DialogService } from 'share';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private dialogService: DialogService,
    private autService: AutService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authToken();
  }

  async authToken() {
    const token = LocalStorageUtil.getItem(ACCESS_TOKEN_KEY);
    if (token) {
      this.dialogService.openLoading();
      const res = await this.autService.authToken().firstValueFrom();
      if (res.message === "Isvalid") {
        this.router.navigateByUrl("he-thong");
      }

      if (res.error === "Unauthorized") {
        this.router.navigateByUrl("dang-nhap");
      }
      this.dialogService.closeLoading();
    }
  }
}
