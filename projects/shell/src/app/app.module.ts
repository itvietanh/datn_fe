import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutes } from './app.routing';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { ReactiveFormsModule } from '@angular/forms';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { DatePipe } from '@angular/common';
import { NZ_I18N, vi_VN } from 'ng-zorro-antd/i18n';
import { NZ_CONFIG, NzConfig } from 'ng-zorro-antd/core/config';
import { FormModule } from 'common/base/module/form.module';
import { DialogLoadingComponent } from 'common/base/module/dialog-loading/dialog-loading.component';
import { DialogConfirmComponent } from 'common/base/module/dialog-confirm/dialog-confirm.component';
import { NoDataComponent } from 'common/base/module/no-data/no-data.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/** config angular i18n **/
import { registerLocaleData } from '@angular/common';
import vi from '@angular/common/locales/vi';
import { DialogConfirmDataModule } from 'common/base/module/dialog-confirm-data/dialog-confirm-data.module';
import {
  FILE_BASE_URL,
  API_BASE_URL,
  PrivilegeService,
  SettingService,
  AccommodationFacilityService,
} from 'share';
import { AuthorizeInterceptor } from 'common/base/interceptors/authorize.interceptor';
import { ErrorInterceptor } from 'common/base/interceptors/error.interceptor';
import { GlobalErrorHandler } from 'common/base/interceptors/global-error-handler.service';
import { environment } from '@env/environment';
import { AuthGuard } from 'common/base/service/auth.guard';

registerLocaleData(vi);

const ngZorroConfig: any = {
  empty: {
    nzDefaultEmptyContent: NoDataComponent,
  },
  modal: {
    nzMaskClosable: false,
    nzKeyboard: false,
  },
};

@NgModule({
  declarations: [
    AppComponent,
    DialogLoadingComponent,
    DialogConfirmComponent,
    NoDataComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    FormModule,
    NzInputModule,
    HttpClientModule,
    NzModalModule,
    NzDrawerModule,
    NzMessageModule,
    NzNotificationModule,
    ReactiveFormsModule,
    NzDropDownModule,
    NzToolTipModule,
    NzEmptyModule,
    DialogConfirmDataModule,
    AppRoutes,
  ],
  providers: [
    DatePipe,
    AuthGuard,
    // CanDeactivateGuard,
    { provide: NZ_I18N, useValue: vi_VN },
    {
      provide: NZ_CONFIG,
      useValue: ngZorroConfig,
    },
    {
      provide: API_BASE_URL,
      useValue: environment.baseUrl,
    },
    {
      provide: FILE_BASE_URL,
      useValue: environment.baseUrl + 'files',
    },
    { provide: HTTP_INTERCEPTORS, useClass: AuthorizeInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [
        PrivilegeService,
        SettingService,
        AccommodationFacilityService,
      ],
      multi: true,
    },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
export function initializeApp(
  privi: PrivilegeService,
  setting: SettingService,
  accom: AccommodationFacilityService
) {
  return (): Promise<any> => {
    return new Promise<void>(async (resolve) => {
      const path = location.pathname;
      if (
        path.indexOf('/auth/') !== -1 ||
        path.indexOf('/error/') !== -1 ||
        path.indexOf('/assets/') !== -1
      ) {
        resolve();
        return;
      }
      // await Promise.all([user.initUser(), setting.init(), accom.initData()]);
      // menu.verifyMenu(privi.listPrivilege);
      resolve();
    });
  };
}
