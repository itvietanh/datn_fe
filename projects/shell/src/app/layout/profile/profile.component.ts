import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ValidatorExtension } from 'common/validator-extension';
import { AutService, UnitService } from 'share';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProfileComponent implements OnInit {
  public profileData: any;
  public myForm: FormGroup;
  constructor(
    public userService: AutService,
    public unitService: UnitService,
    private fb: FormBuilder
  ) {
    this.myForm = this.fb.group({
      username: [null],
      email: [null],
      phoneNumber: [
        null,
        ValidatorExtension.phoneNumberVN('Số điện thoại sai định dạng'),
      ],
      lastLogin: [null],
      units: [null],
    });
  }

  ngOnInit() {
    this.profileData = this.userService.userInfo;
    this.myForm.patchValue(this.profileData);
    this.myForm.disable();
  }
}
