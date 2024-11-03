import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'common/base/service/message.service';
import { DialogMode, DialogService } from 'common/share/src/service/base/dialog.service';
import { DiaBanService } from 'share';

@Component({
  selector: 'app-guest-detail',
  templateUrl: './guest-detail.component.html',
  styleUrls: ['./guest-detail.component.scss']
})
export class GuestDetailComponent implements OnInit {
  @Input() id: any;
  @Input() uuid: any;
  @Input() mode: any;
  @Output() onClose = new EventEmitter<any | null>();
  myForm!: FormGroup;


  constructor(
    private fb: FormBuilder,
    private dialogService: DialogService,
    private messageService: MessageService,
    public diaBanService: DiaBanService,

  ) {
    this.myForm = this.fb.group({
      name: [null],
      phoneNumber: [null],
      idNumber: [null]
    });
  }

  async ngOnInit() {
    if (this.uuid) this.getData();
    if (this.mode === DialogMode.view) {
      this.myForm.disable();
    };
  }

  async getData() {
    this.dialogService.openLoading();
    // const rs = await this.hotelService.findOne(this.uuid).firstValueFrom();
    // if (rs) {
    // this.myForm.patchValue(rs.data);
    // }
    this.dialogService.closeLoading();
  }
  async handlerSubmitData() {
    this.myForm.markAllAsDirty();
    if (this.myForm.invalid) return;
    const formData = this.myForm.getRawValue();
    this.dialogService.openLoading();
    if (this.uuid) {
      //Update
      // await this.hotelService.edit(this.uuid, formData).firstValueFrom();
    } else {
      //Create
      // await this.hotelService.add(formData).firstValueFrom();
    }
    this.dialogService.closeLoading();
    this.messageService.notiMessageSuccess("Lưu dữ liệu thành công!");
    this.close(true);
  }

  close(data?: any) {
    this.onClose.emit(data);
  }
}
