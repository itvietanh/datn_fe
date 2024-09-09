import { Location, LocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ACCESS_TOKEN_KEY, LocalStorageUtil } from 'common/base/utils';
import { finalize } from 'rxjs';
import { AutService, DialogService } from 'share';

@Component({
  selector: 'app-login-vneid',
  templateUrl: './login-vneid.component.html',
})
export class LoginVneidComponent implements OnInit {
  constructor(
    private ar: ActivatedRoute,
    private autService: AutService,
    private dialogService: DialogService,
    private local: LocationStrategy
  ) {}

  ngOnInit(): void {
    const code = this.ar.snapshot.queryParamMap.get('code');
    if (!code) {
      location.href = this.autService.loginVneid();
      return;
    }
    this.dialogService.openLoading();
    this.autService
      .loginByCode(code)
      .pipe(finalize(() => this.dialogService.closeLoading()))
      .subscribe({
        next: (res) => {
          LocalStorageUtil.setItem(ACCESS_TOKEN_KEY, res.data.token);
          location.href = this.local.getBaseHref();
        },
        error: (error) => {},
      });
  }
}
