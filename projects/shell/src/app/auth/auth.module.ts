import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormModule } from 'common/base/module/form.module';
import { AuthComponent } from './auth.component';
import { LoginCallbackComponent } from './login-callback/login-callback.component';
import { LoginComponent } from './login/login.component';
import { LogoutCallbackComponent } from './logout-callback/logout-callback.component';
import { LogoutComponent } from './logout/logout.component';
import { LoginVneidComponent } from './login-vneid/login-vneid.component';

@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    LoginCallbackComponent,
    LogoutComponent,
    LogoutCallbackComponent,
    LoginVneidComponent,
  ],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: AuthComponent,
        children: [
          { path: 'login', component: LoginComponent },
          { path: 'login-vneid', component: LoginVneidComponent },
          // { path: 'login-callback', component: LoginCallbackComponent },
          { path: 'logout', component: LogoutComponent },
          // { path: 'logout-callback', component: LogoutCallbackComponent }
        ],
      },
    ]),
    CommonModule,
    FormModule,
  ],
})
export class AuthModule { }
