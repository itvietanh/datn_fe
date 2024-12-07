import { Component, ViewChild } from '@angular/core';
import BarcodeFormat from '@zxing/library/esm/core/BarcodeFormat';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { MessageService } from 'common/base/service/message.service';
import {
  CUSTOMER_SCANNER_SELECTED_INDEX_KEY,
  LocalStorageUtil,
  QR_CODE_ID_KEY,
} from 'common/base/utils';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { catchError, delay, map, of, switchMap, takeUntil, tap } from 'rxjs';
import {
  DestroyService,
  DiaBanService,
  NationalityService,
  ResidentsService,
} from 'share';

@Component({
  selector: 'app-customer-scanner',
  templateUrl: './customer-scanner.component.html',
  styleUrls: ['./customer-scanner.component.scss'],
  providers: [DestroyService],
})
export class CustomerScannerComponent {
  @ViewChild(ZXingScannerComponent) child!: ZXingScannerComponent;

  selectedIndex =
    LocalStorageUtil.getItem<number>(
      CUSTOMER_SCANNER_SELECTED_INDEX_KEY,
      'number'
    ) || 0;
  readVNeIdProcessing = false;
  camerasNotFound = false;
  loading = '';
  onDataChange: (data: any, scanMulti: boolean | undefined) => void = () => { };
  tabs: any;
  allowedFormats = [BarcodeFormat.QR_CODE];

  public scanMulti: boolean = false;

  constructor(
    private diaBanService: DiaBanService,
    private nationalityService: NationalityService,
    private residentsService: ResidentsService,
    private destroy$: DestroyService,
    private messageService: MessageService,
    private modal: NzModalRef
  ) {

    // init load localstore
    const savedValue = localStorage.getItem('scanMulti');
    if (savedValue !== null) {
      this.scanMulti = JSON.parse(savedValue); // Chuyển giá trị chuỗi thành boolean
    }
  }

  selectedIndexChange(index: number) {
    // Lưu chỉ số tab đã chọn vào LocalStorage
    LocalStorageUtil.setItem(CUSTOMER_SCANNER_SELECTED_INDEX_KEY, index);
    // Hủy observable và reset trạng thái
    this.destroy$.next();
    this.readVNeIdProcessing = false;
    this.loading = '';

    // Cập nhật selectedIndex để thay đổi tab
    this.selectedIndex = index;
  }

  goLeft() {
    if (this.selectedIndex > 0) {
      // Cập nhật selectedIndex và xử lý các logic khác
      this.selectedIndexChange(this.selectedIndex - 1);
    }
  }

  goRight() {
    if (this.selectedIndex == 3) {

    } else {
      this.selectedIndexChange(this.selectedIndex + 1);
    }
  }


  closeDialog() {
    this.modal.destroy();
  }

  scanSuccess(value: string) {
    const values = value.split('|');
    switch (values.length) {
      case 1:
        this.readVneid(values[0]);
        break;
      case 7:
        this.readIdentityCard(values);
        break;
      case 10:
        this.readPassport(values);
        break;
      case 11:
        this.readIdentityCard(values);
        break;
      default:
        break;
    }
  }

  scanVneidShared(qrCodeId: string) {
    return of(null).pipe(
      delay(500),
      switchMap(() =>
        this.residentsService.getVneidShared(qrCodeId).pipe(
          map((res) => res.data),
          catchError((err) => {
            this.destroy$.next();
            this.loading = '';
            this.readVNeIdProcessing = false;
            if (qrCodeId !== LocalStorageUtil.getItem(QR_CODE_ID_KEY)) {
              this.messageService.alert(err.error.errors.message);
            }
            return of(undefined);
          }),
          tap((value) => {
            if (!value) {
              this.scanVneidShared(qrCodeId).subscribe();
              return;
            }
            this.scanSuccess(value!);
            this.destroy$.next();
            this.readVNeIdProcessing = false;
          })
        )
      ),
      takeUntil(this.destroy$)
    );
  }

  private readVneid(qrCode: string) {
    if (this.readVNeIdProcessing) return;
    this.readVNeIdProcessing = true;
    this.residentsService.reqVneidShareInfo(qrCode).subscribe({
      next: (res) => {
        this.loading = 'Đang chờ đồng ý chia sẻ thông tin';
        this.scanVneidShared(res.data.qrCodeId).subscribe();
      },
      error: (err) => {
        this.readVNeIdProcessing = false;
        this.messageService.notiMessageError(err.error.errors.message);
      },
    });
  }

  private async readIdentityCard(values: string[]) {
    const [
      identityNo,
      _identityNoOld,
      fullName,
      dob,
      sex,
      permanentAddress,
      issuedAt,
    ] = values;
    const data: any = {
      // identityType: IdentityType.CCCD,
      // addressType: AddressType.THUONGTRU,
      identityNo,
      fullName,
      dateOfBirth: this.convertDate(dob),
      gender: this.convertSex(sex),
      // nationalityId: Nationality.VNM,
      isVNeID: !issuedAt,
    };
    const addressItems = permanentAddress.split(', ');
    data.addressDetail = addressItems
      .filter((_, i) => i < addressItems.length - 3)
      .join(', ');
    data.provinceId = await this.getAddress(
      'T',
      addressItems[addressItems.length - 1]
    );
    data.districtId = await this.getAddress(
      'Q',
      addressItems[addressItems.length - 2],
      data.provinceId
    );
    data.wardId = await this.getAddress(
      'P',
      addressItems[addressItems.length - 3],
      data.districtId
    );

    this.onDataChange(data, this.scanMulti);
    this.modal.destroy(data);
  }

  private async readPassport(values: string[]) {
    const [
      type,
      nationality,
      surname,
      name,
      docNum,
      _issCountry,
      dob,
      sex,
      _exp,
      optional,
    ] = values;
    const dict: any = {
      P: {
        // identityType: IdentityType.HC,
        identityNo: docNum,
      },
      I: {
        // identityType: IdentityType.CCCD,
        identityNo: optional,
      },
    };
    const isVNM = nationality === 'VNM';
    const data: any = {
      ...dict[type],
      fullName: isVNM ? `${surname} ${name}` : `${name} ${surname}`,
      dateOfBirth: this.convertDate(dob),
      gender: this.convertSexNational(sex),
      // nationalityId: isVNM
      //   ? Nationality.VNM
      //   : await this.getNationalId(nationality),
      isVNeID: false,
    };
    this.modal.destroy(data);
  }

  setScanMulti(event: any) {
    this.scanMulti = event;
    //save localstore
    localStorage.setItem('scanMulti', JSON.stringify(this.scanMulti));

  }

  private async getNationalId(code: string) {
    const res = await this.nationalityService
      .getCombobox({ size: 1, code })
      .firstValueFrom();
    return res.data?.items.length ? res.data?.items[0].value : 1;
  }

  private async getAddress(type: string, value: string, parentId?: number) {
    const res = await this.diaBanService
      .getCombobox({
        capDiaChinh: type,
        tenNganGon: value,
        diaChinhChaId: parentId,
      })
      .firstValueFrom();
    return res.data!.items.length > 0 ? res.data?.items[0].value : null;
  }

  private convertSex(value: string) {
    const dict: any = { Nam: 5, Nữ: 6 };
    return dict[value] || 7;
  }

  private convertSexNational(value: string) {
    const dict: any = { M: 5, F: 6 };
    return dict[value] || 7;
  }


  private convertDate(value: string) {
    return Number(
      `${value.substring(4)}${value.substring(2, 4)}${value.substring(0, 2)}`
    );
  }
}
