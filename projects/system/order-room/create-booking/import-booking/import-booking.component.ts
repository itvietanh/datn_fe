import { Component, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'common/base/service/message.service';
import { ValidatorExtension } from 'common/validator-extension';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { DiaBanService, DialogService } from 'share';
import { read, utils } from 'xlsx';

@Component({
  selector: 'app-import-booking',
  templateUrl: './import-booking.component.html',
  styleUrls: ['./import-booking.component.scss']
})
export class ImportBookingComponent implements OnInit {
  @Output() onClose = new EventEmitter<any | null>();

  myForm!: FormGroup;
  uploading = false;
  fileList: NzUploadFile[] = [];
  rows: any[] = [];
  public listOfData: any;
  public isLoading?: boolean;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private diaBanService: DiaBanService,
    private ref: ElementRef,
    // private importBookingService: ImportBookingService,

  ) { }

  async ngOnInit() {
    this.myForm = this.fb.group({
      importBookingData: this.fb.group({
        // facilityId: [null, ValidatorExtension.required()],
        // fileName: [null, ValidatorExtension.required()],
        // name: [
        //   null,
        //   [
        //     ValidatorExtension.required(),
        //     ValidatorExtension.maxLength(250, 'Không được nhập quá 250 ký tự'),
        //   ],
        // ],
      }),
      importBookingStayData: this.fb.array([]),
    });

  }
  async submit() {
    this.onClose.emit(this.listOfData);
  }

  beforeUpload = (file: NzUploadFile): boolean => {

    this.uploading = true;
    // this.importBookingService.upload({ file: file })
    //   .firstValueFrom()
    //   .then(rs => {
    //     this.listOfData = rs;
    //     this.mappingSexData(this.listOfData);

    //     // Lọc dữ liệu có status = 2
    //     const status2Data = this.listOfData.filter((item: any) => item.status === 2);

    //     // Đếm số lượng và thông báo
    //     const countStatus2 = status2Data.length;
    //     if(countStatus2 === 0){
    //     }else{
    //       this.messageService.alert(`Có ${countStatus2} dữ liệu lỗi`);
    //     }
    //     this.uploading = false;

    //   }).catch(error => {
    //     this.uploading = false;
    //   });

    return false;
  };
  mappingSexData(source: any[]) {
    source.getMapingCombobox(
      'provinceCode',
      'provinceText',
      this.diaBanService,
      null,
      'getComboboxCityByCode'
    );
    source.getMapingCombobox(
      'districtCode',
      'districtText',
      this.diaBanService,
      null,
      'getComboboxDistrictByCode'
    );
    source.getMapingCombobox(
      'wardCode',
      'wardText',
      this.diaBanService,
      null,
      'getComboboxVillageByCode'
    );
  }

  close(data: any = null) {
    this.onClose.emit(data);
  }

}
