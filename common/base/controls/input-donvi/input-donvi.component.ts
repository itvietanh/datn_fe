import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ValidatorExtension } from 'common/validator-extension';
import { takeUntil } from 'rxjs';
import { DestroyService, DonViService } from 'share';

@Component({
  selector: 'input-donvi',
  templateUrl: './input-donvi.component.html',
  styleUrls: ['./input-donvi.component.scss'],
  providers: [DestroyService],
})
export class InputDonviComponent implements OnInit, OnDestroy {
  @Input() city!: AbstractControl | null;
  @Input() district!: AbstractControl | null;
  @Input() village!: AbstractControl | null;
  @Input() address: AbstractControl | null = null;

  @Input() donvi: AbstractControl | null = null;

  @Input() placeholderCity: string = 'Tỉnh/ Thành phố';
  @Input() placeholderDistrict: string = 'Quận/Huyện';
  @Input() placeholderVillage: string = 'Phường/Xã';
  @Input() placeholderAddress: string = 'Địa chỉ chi tiết';

  @Input() placeholderDonvi: string = 'Cơ quan công an';

  @Input() isRequired: boolean | undefined = undefined;

  @Input() apiService: any;

  @Input() actionNameCity: string | undefined;
  @Input() actionNameDistrict: string | undefined;
  @Input() actionNameVillage: string | undefined;

  @Input() actionNameDiaChinh: string | undefined;
  @Input() autoSelectFirst = false;

  public myForm: FormGroup | undefined;
  public isLoading = true;
  public whereDistrict: any = { diaChinhChaId: null };
  public whereVillage: any = { diaChinhChaId: null };

  public whereDiachinh: any = { diaChinhId: null };
  private sub1: any;
  private sub2: any;
  public dataReq = true;
  public reqValid: any = {};

  //Cồn Cỏ (Quảng Trị), Bạch Long Vĩ (Hải Phòng), Hoàng Sa (Đà Nẵng), Lý Sơn (Quảng Ngãi), Côn Đảo (Bà Rịa – Vũng Tàu).
  public listMaHuyenKhongXa: any[] = [449, 654, 328, 498, 466];
  public validXaInit: boolean = false;
  validReq = ValidatorExtension.required('');

  constructor(
    private fb: FormBuilder,
    public donviService: DonViService,
    private destroy$: DestroyService
  ) {}

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

    if (!this.actionNameDiaChinh) {
      this.actionNameDiaChinh = 'getComboboxDiaChinh';
    }

    this.myForm = this.fb.group({
      city: this.city,
      district: this.district,
      village: this.village,
      donvi: this.donvi,
      donviLabel: [null],
    });
    if (this.address) {
      this.myForm.addControl('address', this.address);
    }

    this.donvi?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((x) => {
      if (x) {
        this.getPoliceOfficeLabel({ values: x });
      }
    });

    this.checkDisable();
    this.sub1 = this.myForm.get('city')?.valueChanges.subscribe((x) => {
      if (x) {
        this.whereDistrict = { diaChinhChaId: x };
      } else {
        this.whereDistrict = { diaChinhChaId: null };
      }
    });
    this.sub2 = this.myForm.get('district')?.valueChanges.subscribe((x) => {
      if (x) {
        this.whereVillage = { diaChinhChaId: x };
      } else {
        this.whereVillage = { diaChinhChaId: null };
      }
    });

    this.myForm.get('donviLabel')?.setValidators(null);
    this.validXaInit = this.reqValid.village;

    this.isLoading = false;
    this.changeDistrict(true);
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
    const valCity = this.myForm?.get('city')?.value;
    if (valCity) {
      this.whereDiachinh = { diaChinhId: valCity };
    } else {
      this.whereDiachinh = { diaChinhId: null };
    }
    // this.myForm?.get('donvi')?.setValue(null);
    this.getPoliceOffice(this.whereDiachinh);
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
      this.reqValid.village = false;
    } else {
      this.myForm?.get('village')?.setValidators(this.validReq);
      this.reqValid.village = true;
    }

    const valueCity = this.myForm?.get('city')?.value;
    if (district) {
      this.whereDiachinh = { diaChinhId: district };
    } else {
      this.whereDiachinh = { diaChinhId: valueCity };
    }
    // this.myForm?.get('donvi')?.setValue(null);
    this.getPoliceOffice(this.whereDiachinh, init);

    this.checkDisable(init);
  }

  changeVillage() {
    const valVillage = this.myForm?.get('village')?.value;
    const valDistrict = this.myForm?.get('district')?.value;
    if (valVillage) {
      this.whereDiachinh = { diaChinhId: valVillage };
    } else {
      this.whereDiachinh = { diaChinhId: valDistrict };
    }
    // this.myForm?.get('donvi')?.setValue(null);
    this.getPoliceOffice(this.whereDiachinh);
    this.checkDisable();
  }

  getPoliceOffice(params: any = {}, init: boolean = false) {
    if (!params.diaChinhId) {
      this.myForm?.get('donvi')?.setValue(null);
      if (!init) {
        this.myForm?.get('donviLabel')?.setValue(null);
      }
      return;
    }
    this.donviService.getCombobox(params).subscribe((res) => {
      this.myForm?.get('donvi')?.setValue(res.data?.items.at(0).value);
      this.myForm?.get('donviLabel')?.setValue(res.data?.items.at(0).label);
    });
  }

  getPoliceOfficeLabel(params: any = {}) {
    this.donviService.getCombobox(params).subscribe((res) => {
      this.myForm?.get('donviLabel')?.setValue(res.data?.items.at(0).label);
    });
  }

  checkDisable(init: boolean = false) {
    let cityValue = this.myForm?.get('city')?.value;
    let districtValue = this.myForm?.get('district')?.value;

    if (!init) {
      this.myForm?.enable();
    }

    if (init) {
      this.myForm?.get('donviLabel')?.disable();
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
