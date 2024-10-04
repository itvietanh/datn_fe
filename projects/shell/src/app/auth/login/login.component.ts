import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
 route = inject(Router);
 dialogService = inject(DialogService);
  ngOnInit() {

  }

  loginF:FormGroup = new FormGroup({
    email: new FormControl('',[Validators.required,Validators.email]),
    password: new FormControl('',[Validators.required, Validators.minLength(6)]),
  });
  onSubmit(){
    if(this.loginF.invalid){return;}  
    console.log(this.loginF.value);
    const mockLoginSuccess = true;
    if(mockLoginSuccess){
      this.dialogService.open("Đăng nhập thành công",'success')
      console.log("Đăng nhập thành công", this.loginF.value);
      this.route.navigate(['/he-thong/trang-chu'])
      
    }else{
      this.dialogService.open("Đăng nhập thất bại!",`error`)
    }
  }
}
