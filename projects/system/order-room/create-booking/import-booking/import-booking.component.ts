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
  listGuest: any[] = [];

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private diaBanService: DiaBanService,
    private ref: ElementRef,
    // private importBookingService: ImportBookingService,

  ) { }

  async ngOnInit() {
    this.myForm = this.fb.group({
    });

  }
  async submit() {
    this.onClose.emit(this.listGuest);
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.listGuest = [];
    this.uploading = true;
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(file as any);

    reader.onload = (e: any) => {
      const wb = read(e.target.result, { type: 'binary' });
      const rows = utils.sheet_to_json<any[]>(wb.Sheets[wb.SheetNames[0]], {
        header: 1,
      });

      let index = 0;
      this.listGuest = rows
        .slice(1)
        .filter((row: any) => row.length > 1)
        .map((column: any) => {
          console.log('column', column);
          index++;
          return {
            stt: index,
            fullName: column[1],
            birthDateText: column[2],
            gender: column[3],
            idNumber: column[4],
            phoneNumber: column[5],
            provinceCode: column[7],
            districtCode: column[8],
            wardCode: column[9],
            addressDetail: column[6],
            checkInText: column[13],
            checkOutText: column[14],
          };
        });
      this.uploading = false;
    };
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
