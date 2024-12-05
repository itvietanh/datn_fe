import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ExtentionService } from 'common/base/service/extention.service';
import { MessageService } from 'common/base/service/message.service';
import { MenuService } from 'common/share/src/service/application/hotel/menu.service';
import { DialogMode, DialogService, PrivilegeService, DialogSize } from 'share';

@Component({
  selector: 'app-menu-data-dialog',
  templateUrl: './menu-data-dialog.component.html',
  styleUrls: ['./menu-data-dialog.component.scss']
})
export class MenuDataDialogComponent implements OnInit {
  @Input() id: any;
  @Input() uuid:any;
  @Input() data: any;
  @Input() mode: string = DialogMode.view;
  @Output() onClose = new EventEmitter<any | null>();

  public myForm: FormGroup;
  public listAction: any[] = [];

  public isLoading: boolean | null = null;

  public listMenu: any[] = [];

  public formDataOrgine?: string;

  public hasChange = false;

  constructor(
    private fb: FormBuilder,
    private dialogService: DialogService,
    private messageService: MessageService,
    public menuService: MenuService,
    private ex: ExtentionService,
  ) {
    this.myForm = this.fb.group({
      id: [null],
      code: [null],
      name: [null],
      icon: [null],
      parentUid: [null],
      url: [null],
      isShow: [null],
      description: [null],
      privileges: [[]],
      index: [null]
    });
  }

  ngOnInit() {
    this.initData();
  }

  async initData() {
    this.myForm.reset();

    this.dialogService.openLoading();
    if (this.id) {
      const res = await this.menuService.findOne(this.id).firstValueFrom();
      const data = res.data;
      if (data.is_show === 1) {
        data.isShow = true;
      }
      this.myForm.patchValue(data);
    }

    if (this.mode === DialogMode.add) {
      this.myForm.patchValue({
        isShow: 1,
      });
    }

    if (this.mode === DialogMode.view) this.myForm.disable();
    // this.myForm.get('parentUid')?.disable();

    this.saveDataOrgine();
    this.dialogService.closeLoading();
  }

  saveDataOrgine() {
    this.formDataOrgine = JSON.stringify(this.myForm.getRawValue());
  }


  async handlerSubmitData() {
    this.myForm.markAllAsDirty();
    if (this.myForm.invalid)
    return;

    const formData = this.myForm.getRawValue();

    this.dialogService.openLoading();
    if (this.id) {
      //Update
      if (formData.isShow) {
        formData.is_show = 1;
      } else {
        formData.is_show = 0;
      }
      await this.menuService.edit(this.id, formData).firstValueFrom();
    } else {
      //Create
      formData.id = this.ex.newGuid();
      await this.menuService.add(formData).firstValueFrom();
    }
    this.dialogService.closeLoading();
    this.messageService.notiMessageSuccess("Lưu dữ liệu thành công!");
    this.close(true);
  }

  close(data?: any) {
    this.onClose.emit(data);
  }

  selectPrivilegeData() {
    const dialog = this.dialogService.openDialog(
      (option) => {
        option.title = 'Chọn thao tác';
        option.size = DialogSize.large;
        // option.component = PrivilegeComponent;
        option.inputs = {
        };
      },
      (eventName, eventValue) => {
        if (eventName === 'onClose') {
          this.dialogService.closeDialogById(dialog.id);
          if (eventValue) {
            this.myForm.get('privileges')?.setValue(eventValue);
          }
        }
      }
    );
  }

  async deletePrivilegeData(item: any) {
    const confirm = await this.messageService.confirm('Bạn có chắc chắn muốn xóa dữ liệu này không?');
    if (!confirm) return;

    this.dialogService.openLoading();
    let privileges: any[] = this.myForm.get('privileges')?.value;
    privileges = privileges.filter(x => x !== item.id);
    this.myForm.get('privileges')?.setValue(privileges);
    this.dialogService.closeLoading();
  }

  closeDialog() {
    this.onClose.emit(this.hasChange);
  }
}
