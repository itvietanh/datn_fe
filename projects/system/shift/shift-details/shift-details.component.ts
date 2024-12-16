import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ExtentionService } from "common/base/service/extention.service";
import { MessageService } from "common/base/service/message.service";
import { EmployeeService } from "common/share/src/service/application/hotel/employee.service";
import { HotelService } from "common/share/src/service/application/hotel/hotel.service";
import { ShiftService } from "common/share/src/service/application/hotel/shift.service";
import { ValidatorExtension } from "common/validator-extension";
import { DialogService, DialogMode, PagingModel, DialogSize } from "share";

@Component({
  selector: 'app-guest-details',
  templateUrl: './shift-details.component.html',
  styleUrls: ['./shift-details.component.scss'],
})
export class ShiftDetailComponent implements OnInit {
  @Input() id: any;
  @Input() uuid: any;
  @Input() mode: any;
  @Output() onClose = new EventEmitter<any | null>();
  myForm: FormGroup;
  loading = true;
  public paging: any;
  constructor(
    private messageService: MessageService,
    private fb: FormBuilder,
    private dialogService: DialogService,
    public hotelService: HotelService,
    private shiftService: ShiftService,
  ) {
    this.myForm = this.fb.group({
      name:[null,ValidatorExtension.required()],
      description:[null,ValidatorExtension.required()],
      salary:[null,ValidatorExtension.required()],
    })
  }

  async ngOnInit() {
    this.loading = true;
    if (this.id) this.getData();
    if (this.mode === DialogMode.view) {
      this.myForm.disable();
    };
    this.loading = false;
  }

  async getData() {
    this.dialogService.openLoading();
    const rs = await this.shiftService.findOne(this.id).firstValueFrom();
    if (rs.data) {
      this.myForm.patchValue(rs.data);
    }
    this.dialogService.closeLoading();
  }

  async handlerSubmitData() {
    this.myForm.markAllAsDirty();
    if (this.myForm.invalid) return;
    const formData = this.myForm.getRawValue();
    this.dialogService.openLoading();
    if (this.id) {
      //Update
      await this.shiftService.edit(this.id, formData).firstValueFrom();
    } else {
      //Create
      await this.shiftService.add(formData).firstValueFrom();
    }
    this.dialogService.closeLoading();
    this.messageService.notiMessageSuccess("Thêm dữ liệu thành công!");
    this.close(true);
  }

  close(data?: any) {
    this.onClose.emit(data);
  }

}
