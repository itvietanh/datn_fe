import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ACCESS_TOKEN_KEY, LocalStorageUtil } from 'common/base/utils';
import { ValidatorExtension } from 'common/validator-extension';
import { finalize } from 'rxjs';
import { DialogService } from 'share';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit {
  public myForm: FormGroup;
  public redirectLogin!: string;

  constructor(
    private ar: ActivatedRoute,
    private dialogService: DialogService,
    private fb: FormBuilder,
    private location: Location
  ) {
    this.myForm = this.fb.group({
      username: [null, ValidatorExtension.required()],
      password: [null, ValidatorExtension.required()],
    });
  }

  ngOnInit() {
    this.redirectLogin = this.ar.snapshot.queryParams['redirect'];
    if (!this.redirectLogin) this.redirectLogin = '/';
  }

  async submitForm() {
    this.myForm.markAllAsDirty();
    if (this.myForm.invalid) {
      return;
    }
    this.dialogService.openLoading();
    // this.autService
    //   .login(this.myForm.value)
    //   .pipe(finalize(() => this.dialogService.closeLoading()))
    //   .subscribe({
    //     next: (res) => {
    //       LocalStorageUtil.setItem(ACCESS_TOKEN_KEY, res.data.token);
    //       this.location.go(this.redirectLogin!);
    //     },
    //     error: (error: HttpErrorResponse) => {
    //       this.myForm.bindError(error.error.errors);
    //     },
    //   });
  }
}
