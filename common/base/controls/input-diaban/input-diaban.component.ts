import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ValidatorExtension } from 'common/validator-extension';

@Component({
  selector: 'input-diaban',
  templateUrl: './input-diaban.component.html',
  styleUrls: ['./input-diaban.component.scss'],
})
export class InputDiabanComponent implements OnInit, OnDestroy {
  @Input() city!: AbstractControl | null;
  @Input() district!: AbstractControl | null;
  @Input() village!: AbstractControl | null;
  @Input() address: AbstractControl | null = null;
  @Input() placeholderCity: string = 'Tỉnh/ Thành phố';
  @Input() placeholderDistrict: string = 'Quận/Huyện';
  @Input() placeholderVillage: string = 'Phường/Xã';
  @Input() placeholderAddress: string = 'Địa chỉ chi tiết';

  @Input() apiService: any;
  @Input() actionNameCity: string | undefined;
  @Input() actionNameDistrict: string | undefined;
  @Input() actionNameVillage: string | undefined;

  public myForm: FormGroup | undefined;
  public isLoading = true;
  public whereDistrict: any = { diaChinhChaId: null };
  public whereVillage: any = { diaChinhChaId: null };
  private sub1: any;
  private sub2: any;

  public cityReqDefault = false;
  public districtReqDefault = false;
  public valligeReqDefault = false;

  //Cồn Cỏ (Quảng Trị), Bạch Long Vĩ (Hải Phòng), Hoàng Sa (Đà Nẵng), Lý Sơn (Quảng Ngãi), Côn Đảo (Bà Rịa – Vũng Tàu).
  public listMaHuyenKhongXa: any[] = [449, 654, 328, 498, 466];

  validReq = ValidatorExtension.required('');

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    if (!this.actionNameCity) {
      this.actionNameCity = 'getComboboxCity';
    }
    if (!this.actionNameDistrict) {
      this.actionNameDistrict = 'getComboboxDistrict';
    }
    if (!this.actionNameVillage) {
      this.actionNameVillage = 'getComboboxVillage';
    }

    if (this.address) {
      this.myForm = this.fb.group({
        city: this.city,
        district: this.district,
        village: this.village,
        address: this.address,
      });
    } else {
      this.myForm = this.fb.group({
        city: this.city,
        district: this.district,
        village: this.village,
      });
    }

    this.sub1 = this.myForm.get('city')?.valueChanges.subscribe((x) => {
      if (x) {
        this.whereDistrict = { diaChinhChaId: x };
      } else {
        this.whereDistrict = { diaChinhChaId: null };
      }
    });
    this.sub2 = this.myForm.get('district')?.valueChanges.subscribe((x) => {
      console.log('district change');

      if (x) {
        this.whereVillage = { diaChinhChaId: x };
      } else {
        this.whereVillage = { diaChinhChaId: null };
      }
    });

    this.isLoading = false;

    // this.cityReqDefault = this.required(this.myForm.get('city'));
    // this.districtReqDefault = this.required(this.myForm.get('district'));
    this.valligeReqDefault = this.required(this.myForm.get('village'));

    this.changeDistrict(true);
  }

  required(control: any) {
    let validators = control['_rawValidators'] || [];
    if (!Array.isArray(validators)) {
      validators = [validators];
    }
    return validators.some((v: any) =>
      v.toString().includes('controlValidatorRequired')
    );
  }

  ngOnDestroy(): void {
    if (this.sub1) this.sub1.unsubscribe();
    if (this.sub2) this.sub2.unsubscribe();
  }

  changeCity(init: boolean = false) {
    if (!init) {
      this.myForm?.get('district')?.setValue(null);
      this.myForm?.get('village')?.setValue(null);
    }
    this.checkDisable();
  }

  changeDistrict(init: boolean = false) {
    if (!init) {
      this.myForm?.get('village')?.setValue(null);
    }
    let district = this.myForm?.get('district')?.value;
    if (
      district &&
      this.listMaHuyenKhongXa.findIndex((x) => x === district) !== -1
    ) {
      // huyện ko có phường xã nên bỏ req
      this.myForm?.get('village')?.setValidators(null);
    } else {
      // nếu không có giá trị set req về nguyên bản ban đầu
      this.valligeReqDefault
        ? this.myForm?.get('village')?.setValidators(this.validReq)
        : this.myForm?.get('village')?.setValidators(null);
    }

    this.checkDisable(init);
  }

  changeVillage() {
    this.checkDisable();
  }

  checkDisable(init: boolean = false) {
    let cityValue = this.myForm?.get('city')?.value;
    let districtValue = this.myForm?.get('district')?.value;

    if (!init) {
      this.myForm?.enable();
    }

    if (!cityValue) {
      this.myForm?.get('district')?.disableNoEvent();
      this.myForm?.get('village')?.disableNoEvent();
      return;
    }
    if (
      !districtValue ||
      this.listMaHuyenKhongXa.findIndex((x) => x === districtValue) !== -1
    ) {
      this.myForm?.get('village')?.disableNoEvent();
      return;
    }
  }
}
