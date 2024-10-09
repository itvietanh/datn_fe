import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ExtentionService } from "common/base/service/extention.service";
import { MessageService } from "common/base/service/message.service";
import { RoomTypeService } from "common/share/src/service/application/hotel/room-type.service";
import { ValidatorExtension } from "common/validator-extension";
import { DialogService, DialogMode, PagingModel, DialogSize } from "share";

@Component({
  selector: 'app-roomtype-details',
  templateUrl: './roomtype-details.component.html',
  styleUrls: ['./roomtype-details.component.scss'],
})
export class RoomTypeDetailsComponent implements OnInit {
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
    public RoomTypeService: RoomTypeService,
    private ex: ExtentionService,
  ) {
    this.myForm = this.fb.group({
      type_name: [null, ValidatorExtension.required()],
      price_per_hour: [null, [ValidatorExtension.required(), ValidatorExtension.number()]],
      price_per_day: [null, [ValidatorExtension.required(), ValidatorExtension.number()]],
      price_overtime: [null, [ValidatorExtension.required(), ValidatorExtension.number()]],
      vat: [null, [ValidatorExtension.required(), ValidatorExtension.number()]],
      number_of_people: [null, [ValidatorExtension.required(), ValidatorExtension.number()]],
    });
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
    this.dialogService.openLoading;
    const rs = await this.RoomTypeService.findOne(this.uuid).firstValueFrom();
    console.log(rs);
    if (rs) {
      this.myForm.patchValue(rs.data);
    }
    this.dialogService.closeLoading;
  }

  async handlerSubmitData() {
    this.dialogService.openLoading;
    this.myForm.markAllAsDirty();
    if (this.myForm.invalid) return;
    const formData = this.myForm.getRawValue();

    if (this.uuid) {
      //Update
      this.dialogService.openLoading();
      await this.RoomTypeService.edit(this.uuid, formData).firstValueFrom();
      this.dialogService.closeLoading();
    } else {
      //Create
      this.dialogService.openLoading();
      await this.RoomTypeService.add(formData).firstValueFrom();
      this.dialogService.closeLoading();
    }

    this.dialogService.closeLoading;
    this.messageService.notiMessageSuccess("Lưu dữ liệu thành công!");
    this.close(true);
  }

  close(data?: any) {
    this.onClose.emit(data);
  }

} 
