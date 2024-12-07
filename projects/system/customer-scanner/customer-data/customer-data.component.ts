import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ValidatorExtension } from 'common/validator-extension';
import { isEmpty } from 'lodash-es';
import {
  CountryService,
  DestroyService,
  DiaBanService,
  GENDERS,
  NationalityService,
  OccupationService,
  StayingReasonService,
} from 'share';

@Component({
  selector: 'app-customer-data',
  templateUrl: './customer-data.component.html',
  styleUrls: ['./customer-data.component.scss'],
  providers: [DestroyService],
})
export class CustomerDataComponent implements OnInit, OnChanges {
  @Input() form!: FormGroup;
  @Input() data: any;
  @Input() requiredReasonStayId = false;
  @Output() formChange = new EventEmitter<FormGroup>();
  genders = GENDERS;
  // addressTypes = ADDRESS_TYPES;
  // identityTypes = IDENTITY_TYPES;
  loading = false;
  // nationality = Nationality;
  scannerOpening = false;
  init = false;
  public maxDate = new Date();

  constructor(
    private fb: FormBuilder,
    public diaBanService: DiaBanService,
    public nationalityService: NationalityService,
    public countryService: CountryService,
    public occupationService: OccupationService,
    public stayingReasonService: StayingReasonService
  ) {}

  ngOnInit() {
    const data = this.data;
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']?.currentValue) {
      this.onDataChange(this.data);
    }
  }

  onDataChange(data: any) {
    if (data.isVNeID) {
      delete data.isVNeID;
      const keys: string[] = [];
      Object.keys(data).forEach((key) => {
        if (data[key] == null) return;
        const control = this.form.get(key);
        if (!control) return;
        keys.push(key);
      });
      data.notAllowedToBeModified = keys.join(',');
    }
    this.initForm(data);
  }

  onIdentityTypeChange() {
    const data = this.form.getRawValue();
    data.identityName = null;
    data.identityNo = null;
    this.initForm(data);
  }

  onNationalityIdChange() {
    const data = this.form.getRawValue();
    data.identityName = null;
    data.identityNo = null;
    const controls = [
      'countryId',
      'provinceId',
      'districtId',
      'wardId',
      'addressDetail',
    ];
    controls.forEach((key) => {
      data[key] = null;
    });
    this.initForm(data);
  }

  onCountryIdChange() {
    this.form.get('addressDetail')?.reset();
  }

  saveReasonStay(){
    let reasonStayId = this.form.get('reasonStayId')?.value;
    localStorage.setItem('reasonStayId', reasonStayId);
  }

  initForm(data: any = {}) {
    if (isEmpty(data)) {
      data = {
        // identityType: IdentityType.CCCD,
        // nationalityId: Nationality.VNM,
        // addressType: AddressType.THUONGTRU,
      };
    }
    if (!this.init) {
      this.form = this.fb.group({
        identityType: [null, ValidatorExtension.required()],
        identityName: [null],
        identityNo: [null],
        fullName: [
          null,
          [
            ValidatorExtension.required('Họ và tên không được để trống'),
            ValidatorExtension.validNameVN(
              "Họ và tên chỉ được sử dụng chữ cái, dấu khoảng trắng và dấu '"
            ),
            ValidatorExtension.validateUnicode(
              'Bạn đang sử dụng bảng mã Unicode tổ hợp! Vui lòng sử dụng bảng mã Unicode dựng sẵn'
            ),
            ValidatorExtension.maxLength(40, 'Họ tên tối đa 40 ký tự'),
          ],
        ],
        gender: [null, ValidatorExtension.required()],
        phoneNumber: [null, ValidatorExtension.phoneNumber()],
        dateOfBirth: [null, ValidatorExtension.required()],
        email: [null],
        nationalityId: [null, ValidatorExtension.required()],
        countryId: [null],
        addressType: [null],
        addressDetail: [null, ValidatorExtension.required()],
        provinceId: [null],
        districtId: [null],
        wardId: [null],
        occupationId: [null],
        reasonStayId: [
          null,
          this.requiredReasonStayId ? ValidatorExtension.required() : null,
        ],
        workplace: [null],
        notAllowedToBeModified: [null],
        note:[null]
      });
      this.init = true;
    } else {
      this.form.enable();
      this.form.reset();
      ['districtId', 'wardId'].forEach((key) => {
        this.form.get(key)!.disable();
      });
    }

    this.form.patchValueNoEvent(data);
    const identityType = this.form.get('identityType')!;
    const nationality = this.form.get('nationalityId')!;
    // const isVNM = nationality.value === Nationality.VNM;
    // if (isVNM) {
    //   identityType.enable();
    // } else {
    //   identityType.setValue(IdentityType.HC);
    //   identityType.disable();
    // }
    const identityName = this.form.get('identityName')!;
    identityName.setValidators(null);
    const identityNo = this.form.get('identityNo')!;
    // switch (identityType.value) {
    //   case IdentityType.GTK:
    //     identityName.setValidators([ValidatorExtension.required()]);
    //     identityNo.setValidators(null);
    //     break;
    //   case IdentityType.CCCD:
    //     identityNo.setValidators([
    //       ValidatorExtension.required('CCCD không được để trống'),
    //       ValidatorExtension.number('CCCD sai định dạng'),
    //       ValidatorExtension.equalLength(12, 'CCCD có 12 số'),
    //     ]);
    //     break;
    //   case IdentityType.CMND:
    //     identityNo.setValidators([
    //       ValidatorExtension.required('CMND không được để trống'),
    //       ValidatorExtension.number('CMND sai định dạng'),
    //       ValidatorExtension.equalLength(9, 'CMND có 9 số'),
    //     ]);
    //     break;
    //   case IdentityType.HC:
    //     identityNo.setValidators([
    //       ValidatorExtension.required('Hộ chiếu không được để trống'),
    //     ]);
    //     break;
    //   default:
    //     break;
    // }
    const controls = ['addressType', 'provinceId', 'districtId', 'wardId'];
    // controls.forEach((key) => {
    //   this.form
    //     .get(key)!
    //     .setValidators(isVNM ? [ValidatorExtension.required()] : null);
    // });
    // this.form
    //   .get('countryId')!
    //   .setValidators(isVNM ? null : [ValidatorExtension.required()]);
    // if (data.notAllowedToBeModified) {
    //   const keys: string[] = data.notAllowedToBeModified.split(',');
    //   keys.forEach((key) => {
    //     this.form.get(key)?.disableNoEvent();
    //   });
    // }
    this.formChange.emit(this.form);
  }
}
