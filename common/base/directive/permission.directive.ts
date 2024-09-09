import {
  Directive,
  Input,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ElementRef,
  Renderer2,
  HostBinding,
} from '@angular/core';

// set in html:  [permissionExclude]="permissions" --- [permissionInClude]="permissions"
// permissions in component/service

export interface Permission {
  isPermission: boolean;
  permissions?: any | any[];
}

// môi trường dev: set isPermission = false
export const isPermission: boolean = false;

export const PM1_CHUCNANG = [
  'PM1-DSHS_TRICH-XUAT',
  'PM1-DSHS_XEM',
  'PM1-DSHS_KET-XUAT',
  'PM1-DSHS_XOA',
  'PM1-TTC-TTCB_XEM',
  'PM1-TTC-TTCB_SUA',
  'PM1-TTC-TTCB_XAC-NHAN',
  'PM1-TTC-TTCB_XOA',
  'PM1-TD-QTCT_XEM',
  'PM1-TD-QTCT_SUA',
  'PM1-LPCCV_THEM',
  'PM1-LPCCV_SUA',
  'PM1-LPCCV_XOA',
  'PM1-TTKN_THEM',
  'PM1-TTKN_SUA',
  'PM1-TTKN_XOA',
  'PM1-TTBN_THEM',
  'PM1-TTBN_SUA',
  'PM1-TTBN_XOA',
  'PM1-DT-BD_THEM',
  'PM1-DT-BD_SUA',
  'PM1-DT-BD_XOA',
  'PM1-KT-KL_SUA',
  'PM1-KT-KL_THEM-KT',
  'PM1-KT-KL_SUA-KT',
  'PM1-KT-KL_XOA-KT',
  'PM1-KT-KL_THEM-KL',
  'PM1-KT-KL_SUA-KL',
  'PM1-KT-KL_XOA-KL',
  'PM1-DDLSBT_SUA',
  'PM1-DDLSBT_THEM-QHGD',
  'PM1-DDLSBT_SUA-QHGD',
  'PM1-DDLSBT_XOA-QHGD',
  'PM1-CAPNHAT-TUKHAI_XEM-TTCB',
  'PM1-CAPNHAT-TUKHAI_XEM-TDCT',
  'PM1-CAPNHAT-TUKHAI_XEM-DTBD',
  'PM1-CAPNHAT-TUKHAI_XEM-TTQHGD',
  'PM1-CAPNHAT-TUKHAI_XEM-LSBT',
  'PM1-CAPNHAT-TUKHAI_XEM-HCKTGD',
  'PM1-CAPNHAT-TUKHAI_XEM-DGCL',
  'PM1-CAPNHAT-TUKHAI_XEM-LPC',
  'PM1-DUYET_CSDLQD-XEM-CHITIET',
  'PM1-DUYET_CSDLQD-TUCHOI_MOT',
  'PM1-DUYET_CSDLQD-PHEDUYET_MOT',
  'PM1-DUYET_CSDLQD-TUCHOI_NHIEU',
  'PM1-DUYET_CSDLQD-PHEDUYET_NHIEU',
  'PM1-LICHSU_DUYET_CSDLQD_XEM_CHUKYSO',
  'PM1-LICHSU_DUYET_CSDLQD_XEM_LYDO',
  'PM1-LICHSU_DUYET_CSDLQD_XEM_CHITIET',
];

@Directive({
  selector: '[permissionInclude] , [permissionExclude]',
})
export class PermissionDirective implements OnInit, OnDestroy, OnChanges {
  @Input() public permissionInclude: Permission | any | any[] = [];

  @Input() public permissionExclude: Permission | any | any[] = [];

  // attribute
  @HostBinding('attr.disabled') disabled!: boolean | null;
  //

  public listPmMock: any[] = ['1', '2', '3', '4', '5'];

  private isPermission = false;

  constructor(private elementRef: ElementRef, private renderer2: Renderer2) {}

  ngOnInit(): void {
    this.listPmMock = PM1_CHUCNANG;

    if (this.permissionInclude) {
      this.setPermissionInclude(this.permissionInclude);
    }
    if (this.permissionExclude) {
      this.setPermissionExclude(this.permissionExclude);
    }
  }

  ngOnDestroy(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.permissionInclude) {
      this.setPermissionInclude(this.permissionInclude);
    }
    if (this.permissionExclude) {
      this.setPermissionExclude(this.permissionExclude);
    }
  }

  private setPermissionInclude(item: any) {
    if (item && this.isPermission) {
      if (!this.listPmMock.includes(item)) {
        this.disabled = true;
      }
    } else {
    }
  }

  private setPermissionExclude(item: any) {
    if (item && this.isPermission) {
      let character = item.indexOf('_');
      let value = item.substring(character + 1);

      if (!this.listPmMock.includes(value)) {
        this.disabled = true;
      }
    } else {
    }
  }
}
