import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ExtentionService } from "common/base/service/extention.service";
import { MessageService } from "common/base/service/message.service";
import { HotelService } from "common/share/src/service/application/hotel/hotel.service";
import { RoleService } from "common/share/src/service/application/hotel/role.service";
import { ValidatorExtension } from "common/validator-extension";
import { DialogService, DialogMode, PagingModel, DialogSize } from "share";

@Component({
  selector: 'app-roomusingservice-details',
  templateUrl: './role_details.component.html',
  styleUrls: ['./role_details.component.scss'],
})
export class RoleDetailsComponent implements OnInit {
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
    private roleService: RoleService,
    private ex: ExtentionService,
  ) {
    this.myForm = this.fb.group({

      role_name: [null, ValidatorExtension.required()],
      description: [null, ValidatorExtension.required()],

    })
  }

  async ngOnInit() {
    this.loading = true;
    this.getData();
    if (this.id) this.getData();
    if (this.mode === DialogMode.view) {
      this.myForm.disable();
    };
    this.loading = false;
  }
  async getData() {
    this.dialogService.openLoading();
    const rs = await this.roleService.findOne(this.uuid).firstValueFrom();
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
      await this.roleService.edit(this.uuid, formData).firstValueFrom();
    } else {
      //Create
      await this.roleService.add(formData).firstValueFrom();
    }
    this.dialogService.closeLoading();
    this.messageService.notiMessageSuccess("Thêm dữ liệu thành công!");
    this.close(true);
  }

  close(data?: any) {
    this.onClose.emit(data);
  }

}
