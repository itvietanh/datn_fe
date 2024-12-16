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
  loading = false;
  scannerOpening = false;
  init = false;
  public maxDate = new Date();
  listGender: any[] = [
    {
      value: 'Nam',
      label: 'Nam'
    },
    {
      value: 'Nữ',
      label: 'Nữ'
    }
  ];

  constructor(
    private fb: FormBuilder,
    public diaBanService: DiaBanService,
    public nationalityService: NationalityService,
    public countryService: CountryService,
    public occupationService: OccupationService,
    public stayingReasonService: StayingReasonService
  ) {
  }

  ngOnInit() {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // debugger;
    if (changes['data']?.currentValue) {
      this.onDataChange(this.data);
    }
  }

  onDataChange(data: any) {
    const keys: string[] = [];
    Object.keys(data).forEach((key) => {
      if (data[key] == null) return;
      const control = this.form.get(key);
      if (!control) return;
      keys.push(key);
    });
    // data.notAllowedToBeModified = keys.join(',');
    // debugger;
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

  saveReasonStay() {
    let reasonStayId = this.form.get('reasonStayId')?.value;
    localStorage.setItem('reasonStayId', reasonStayId);
  }

  initForm(data: any = {}) {
    data.id_number = data.identityNo ? data.identityNo : data.id_number;
    data.name = data.fullName ? data.fullName : data.name;
    data.address_detail = data.addressDetail ? data.addressDetail : data.address_detail;
    data.province_id = data.provinceId ? data.provinceId : data.province_id;
    data.district_id = data.districtId  ?data.districtId : data.district_id;
    data.ward_id = data.wardId ? data.wardId : data.ward_id;
    if (data.gender === 5) {
      data.gender = "Nam";
    } 

    if (data.gender === 6) {
      data.gender = "Nữ";
    } 
    data.birth_date = data.dateOfBirth ? data.dateOfBirth : data.birth_date;

    if (!this.init) {
      this.form = this.fb.group({
        uuid: [null],
        name: [null, ValidatorExtension.required()],
        phone_number: [null, [ValidatorExtension.phoneNumberVN(), ValidatorExtension.required()]],
        id_number: [null, ValidatorExtension.required()],
        passport_number: [null, ValidatorExtension.required()],
        province_id: [null, ValidatorExtension.required()],
        district_id: [null, ValidatorExtension.required()],
        ward_id: [null, ValidatorExtension.required()],
        nat_id: [196, ValidatorExtension.required()],
        birth_date: [null, ValidatorExtension.required()],
        gender: [null, ValidatorExtension.required()],
        address_detail: [null, ValidatorExtension.required()],
        representative: [null]
      });
      this.init = true;
    } else {
      this.form.enable();
      // this.form.reset();
      // ['districtId', 'wardId'].forEach((key) => {
      //   this.form.get(key)!.disable();
      // });
    }

    this.form.patchValueNoEvent(data);
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
