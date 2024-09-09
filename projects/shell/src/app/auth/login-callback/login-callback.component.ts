import { Location, LocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'share';

@Component({
  selector: 'app-login-callback',
  templateUrl: './login-callback.component.html',
  styleUrls: ['./login-callback.component.scss'],
})
export class LoginCallbackComponent implements OnInit {
  constructor(
    private rt: Router,
    private ar: ActivatedRoute,
    private dialog: DialogService,
    private local: LocationStrategy
  ) {}

  ngOnInit() {
    this.dialog.openLoading();
    const url = this.ar.snapshot.queryParams['redirect'];
    if (url) {
      if (url.startsWith('/public/')) {
        location.href = this.local.getBaseHref();
        return;
      }
      location.href = this.local.prepareExternalUrl(url);
      return;
    }
    location.href = this.local.getBaseHref();
  }
}
