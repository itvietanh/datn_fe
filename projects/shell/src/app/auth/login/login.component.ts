import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExtentionService } from 'common/base/service/extention.service';
import { MessageService } from 'common/base/service/message.service';
import { ACCESS_TOKEN_KEY, HOTEL_ID_KEY, LocalStorageUtil } from 'common/base/utils';
import { AutService } from 'common/share/src/service/application/auth/aut.service';
import { HotelService } from 'common/share/src/service/application/hotel/hotel.service';
import { ValidatorExtension } from 'common/validator-extension';
import { catchError, finalize } from 'rxjs';
import { DialogService } from 'share';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit {
  myForm: FormGroup;
  public redirectLogin!: string;

  constructor(
    private messageService: MessageService,
    private fb: FormBuilder,
    private dialogService: DialogService,
    public hotelService: HotelService,
    private ex: ExtentionService,
    private autService: AutService,
    private ar: ActivatedRoute,
    private location: Location,
    private router: Router
  ) {
    this.myForm = this.fb.group({
      email: [null, ValidatorExtension.required()],
      password: [null, ValidatorExtension.required()],
    })
  }

  ngOnInit() {
    this.redirectLogin = this.ar.snapshot.queryParams['redirect'];
    if (!this.redirectLogin) this.redirectLogin = '/';
    this.authToken();
  }

  async authToken() {
    const token = LocalStorageUtil.getItem(ACCESS_TOKEN_KEY);
    if (token) {
      this.dialogService.openLoading();
      const res = await this.autService.authToken().firstValueFrom();
      // if (res.message === "Isvalid") {
      //   this.router.navigateByUrl("he-thong");
      // }
      if (res.error === "Unauthorized") {
        this.router.navigateByUrl("dang-nhap");
      }
      this.dialogService.closeLoading();
    }
  }

  async submit() {
    this.myForm.markAllAsDirty();
    if (this.myForm.invalid) return;

    const data = this.myForm.getRawValue();
    this.dialogService.openLoading();
    const res = await this.autService.login(data).firstValueFrom();
    if (res && res.access_token) {
      LocalStorageUtil.setItem(ACCESS_TOKEN_KEY, res.access_token);
      LocalStorageUtil.setHotelId(res.employee.hotel_id);
      this.router.navigateByUrl(this.redirectLogin);
    }
    this.dialogService.closeLoading();
  }
}
