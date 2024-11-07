import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ExtentionService } from "common/base/service/extention.service";
import { MessageService } from "common/base/service/message.service";
// import { EmployeeService } from "common/share/src/service/application/hotel/employee.service";
import { HotelService } from "common/share/src/service/application/hotel/hotel.service";
import { MenuService } from "common/share/src/service/application/hotel/menu.service";
import { ValidatorExtension } from "common/validator-extension";
// import { ValidatorExtension } from "common/validator-extension";
import { DialogService, DialogMode, PagingModel, DialogSize } from "share";

@Component({
  selector: 'app-menu-details',
  templateUrl: './menu-details.component.html',
  styleUrls: ['./menu-details.component.scss'],
})
export class MenuDetailsComponent implements OnInit {
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
    // private employeeService:EmployeeService,
    private menuService:MenuService,
    private ex: ExtentionService,
  ) {
    this.myForm = this.fb.group({
      code:[null,ValidatorExtension.required()],
      icon:[null,ValidatorExtension.required()],
      api:[null,ValidatorExtension.required()],
      hotel_id:[null,ValidatorExtension.required()],
      name:[null,ValidatorExtension.required()],
      id:[ex.newGuid()],
      idx:[null, ValidatorExtension.required()],
      is_show:[null,ValidatorExtension.required()]

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
    const rs = await this.menuService.findOne(this.id).firstValueFrom();
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

    if (this.id) {
      //Update
      await this.menuService.edit(this.id, formData).firstValueFrom();
    } else {
      //Create
      await this.menuService.add(formData).firstValueFrom();
    }

    this.dialogService.closeLoading();
    this.messageService.notiMessageSuccess("Thêm dữ liệu thành công!");
    this.close(true);
  }


  close(data?: any) {
    this.onClose.emit(data);
  }

}
