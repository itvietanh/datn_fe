import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ExtentionService } from "common/base/service/extention.service";
import { MessageService } from "common/base/service/message.service";
import { EmployeeService } from "common/share/src/service/application/hotel/employee.service";
import { HotelService } from "common/share/src/service/application/hotel/hotel.service";
import { ValidatorExtension } from "common/validator-extension";
import { DialogService, DialogMode, PagingModel, DialogSize } from "share";

@Component({
  selector: 'app-guest-details',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss'],
})
export class EmployeeDetailComponent implements OnInit {
  @Input() id: any;
  @Input() uuid: any;
  @Input() mode: any;
  @Output() onClose = new EventEmitter<any | null>();
  myForm: FormGroup;
  loading = true;
  public paging: any;

  listRole: any[] = [
    {
      value: 1,
      label: "ADMIN"
    },
    {
      value: 2,
      label: "Nhân Viên"
    }
  ]

  constructor(
    private messageService: MessageService,
    private fb: FormBuilder,
    private dialogService: DialogService,
    public hotelService: HotelService,
    private employeeService: EmployeeService,
    private ex: ExtentionService,
  ) {
    this.myForm = this.fb.group({
      uuid: [ex.newGuid()],
      name: [null, ValidatorExtension.required()],
      email: [null, [ValidatorExtension.required(), ValidatorExtension.email()]],
      password: [null, ValidatorExtension.required()],
      phone: [null, ValidatorExtension.required()],
      address: [null, ValidatorExtension.required()],
      hotel_id: [null, ValidatorExtension.required()],
      role: [null]
    })
  }

  async ngOnInit() {
    this.loading = true;
    if (this.uuid) this.getData();
    if (this.mode === DialogMode.view) {
      this.myForm.disable();
    };
    this.loading = false;
  }

  async getData() {
    this.dialogService.openLoading();
    const rs = await this.employeeService.findOne(this.uuid).firstValueFrom();
    if (rs) {
      this.myForm.patchValue(rs.data);
    }
    this.dialogService.closeLoading();
  }

  async handlerSubmitData() {
    this.myForm.markAllAsDirty();
    if (this.myForm.invalid) return;
    const formData = this.myForm.getRawValue();
    this.dialogService.openLoading();
    if (this.uuid) {
      //Update
      await this.employeeService.edit(this.uuid, formData).firstValueFrom();
    } else {
      //Create
      await this.employeeService.add(formData).firstValueFrom();
    }
    this.dialogService.closeLoading();
    this.messageService.notiMessageSuccess("Thêm dữ liệu thành công!");
    this.close(true);
  }

  close(data?: any) {
    this.onClose.emit(data);
  }

}
