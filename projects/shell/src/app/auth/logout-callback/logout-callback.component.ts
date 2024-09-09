import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-logout-callback',
  templateUrl: './logout-callback.component.html',
})
export class LogoutCallbackComponent implements OnInit {
  constructor(private ar: ActivatedRoute) {}

  ngOnInit() {
    const token: string = this.ar.snapshot.queryParams['idToken'];
    // location.href = `${environment.logout}?id_token_hint=${token}&post_logout_redirect_uri=${environment.logoutRedirect}`;
  }
}
