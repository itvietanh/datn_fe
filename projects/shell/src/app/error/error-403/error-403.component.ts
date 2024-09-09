import { Component } from '@angular/core';

@Component({
  selector: 'app-error-403',
  templateUrl: './error-403.component.html',
})
export class Error403Component {
  login() {
    location.href = '/auth/logout';
  }
}
