import { Component, ElementRef, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MessageService } from 'common/base/service/message.service';
import { ValidatorExtension } from 'common/validator-extension';
import { AutService, DialogService, UnitService } from 'share';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  public profileData: any;
  public myForm: FormGroup;
  constructor(
    public userService: AutService,
    private dialogService: DialogService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private ref: ElementRef) {
    this.myForm = this.fb.group({
      username: [null],
      currentPassword: [null, ValidatorExtension.required()],
      newPassword: [null, ValidatorExtension.required()],
      newPasswordConfirm: [null]
    });

    this.myForm.get('username')?.disable();
    this.myForm.get('newPasswordConfirm')?.addValidators(ValidatorExtension.compareValidator('newPassword', 'Xác nhận mật khẩu không đúng'));
  }

  ngOnInit() {
    this.profileData = this.userService.userInfo;
    this.myForm.patchValue(this.profileData);
  }

  async saveData() {
    this.dialogService.openLoading();

    this.myForm.markAllAsDirty();
    if (this.myForm.invalid) {
      this.myForm.focusError(this.ref);
      this.dialogService.closeLoading();
      return;
    }

    let formData = this.myForm.getRawValue();
    const optionBindForm = { myForm: this.myForm, elementForm: this.ref };
    await this.userService.changePassword(formData).firstValueFrom(optionBindForm);
    this.dialogService.closeLoading();
    await this.messageService.alert('Thay đổi mật khẩu thành công!', 'Đăng nhập lại');
    location.href = '/auth/logout';
  }
}
