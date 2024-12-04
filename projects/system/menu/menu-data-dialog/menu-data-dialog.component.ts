import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
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
    private privilegeService: PrivilegeService,
    private ref: ElementRef
  ) {
    this.myForm = this.fb.group({
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
    await this.getMenu();

    if (this.mode === DialogMode.add) {
      this.myForm.patchValue({
        ...this.data,
        isShow: true,
      });
    } else {
      this.getData();
    }

    await this.getAction();

    if (this.mode === DialogMode.view) this.myForm.disable();
    // this.myForm.get('parentUid')?.disable();

    this.saveDataOrgine();
    this.dialogService.closeLoading();
  }

  saveDataOrgine() {
    this.formDataOrgine = JSON.stringify(this.myForm.getRawValue());
  }

  getData() {
    this.myForm.patchValue(this.data);
  }

  async getMenu() {
    // const rs = await this.menuService.getAll().firstValueFrom();
    // this.listMenu = rs.data!.items.map(x => {
    //   return {
    //     label: x.name,
    //     value: x.id
    //   }
    // })
  }

  async getAction() {
    this.isLoading = true;
    this.listAction = [];
    let privileges: any[] = this.myForm.get('privileges')?.value;
    if (!privileges) privileges = [];
    for (const item of privileges) {
      let rs = await this.privilegeService.findOne(item).firstValueFrom();
      this.listAction.push({
        id: item,
        code: rs.data.code,
        name: rs.data.name
      });
    }
    this.isLoading = false;
  }

  async saveData(type: number) {
    this.dialogService.openLoading();
    this.myForm.markAllAsDirty();

    if (this.myForm.invalid) {
      this.dialogService.closeLoading();
      this.messageService.alert('Dữ liệu nhập liệu chưa đúng vui lòng kiểm tra lại!');
      this.myForm.focusError(this.ref);
      return;
    }

    let formData = this.myForm.getRawValue();
    if (!formData.privileges) formData.privileges = [];
    if (!formData.description) formData.description = this.mode;
    const optionBindForm = { myForm: this.myForm, elementForm: this.ref };
    // if (this.mode === DialogMode.add) {
    //   await this.menuService.add(formData).firstValueFrom(optionBindForm);
    // }
    // if (this.mode === DialogMode.edit) {
    //   await this.menuService.edit(this.id, formData).firstValueFrom(optionBindForm);
    // }
    this.hasChange = true;

    if (type === 1) {
      this.closeDialog();
      this.dialogService.closeLoading();
      return;
    }

    this.initData();
    this.dialogService.closeLoading();
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
            this.getAction();
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
    this.getAction();
    this.dialogService.closeLoading();
  }

  closeDialog() {
    this.onClose.emit(this.hasChange);
  }
}
