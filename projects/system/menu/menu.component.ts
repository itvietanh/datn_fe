import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { MessageService } from "common/base/service/message.service";
import { TableTreeConfigModel, DialogService, UnitService, DialogSize, DialogMode } from "share";
import { MenuDataDialogComponent } from "./menu-data-dialog/menu-data-dialog.component";
import { MenuService } from "common/share/src/service/application/hotel/menu.service";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  public formSearch: FormGroup;
  public listOfData: any[] = [];
  public dataRaw: any[] = [];
  public isLoading?: boolean;

  public showTree = false;

  public tableTreeConfig: TableTreeConfigModel = new TableTreeConfigModel({
    keyId: 'id',
    keyParentId: 'parent',
    collapseDefault: true,
    mapOfExpandedData: {}
  });

  public listStatus: any[] = [
    { value: 1, label: 'Hiển thị' },
    { value: 2, label: 'Ẩn' }
  ];

  constructor(private fb: FormBuilder,
    private dialogService: DialogService,
    private messageService: MessageService,
    public unitService: UnitService,
    private menuService: MenuService,
    private ar: ActivatedRoute) {
    this.formSearch = this.fb.group({
      q: [''],
      status: [1]
    });
  }

  ngOnDestroy(): void {

  }

  ngOnInit() {
    this.getData();
  }

  async getData() {
    this.dialogService.openLoading();

    const rs = await this.menuService.getPaging().firstValueFrom();
    this.dataRaw = rs.data!.items.map(x => {
      return {
        ...x,
        parent: x.parentUid
      };
    })

    this.listOfData = this.tableTreeConfig.convertDataRawToDataTree(this.dataRaw);
    this.dialogService.closeLoading();
  }

  getChid(data: any, item: any, event: any) {
    if (item.children.length > 0) {
      this.tableTreeConfig.collapse(data, item, event);
      return;
    }
  }

  addDataDialog(item: any = null) {
    const dialog = this.dialogService.openDialog(
      (option) => {
        option.title = 'Thêm mới menu';
        option.size = DialogSize.xlarge;
        option.component = MenuDataDialogComponent;
        option.inputs = {
          id: null,
          data: {
            parentUid: item?.id
          },
          mode: DialogMode.add
        };
      },
      (eventName, eventValue) => {
        if (eventName === 'onClose') {
          this.dialogService.closeDialogById(dialog.id);
          if (eventValue) {
            this.getData();
          }
        }
      }
    );
  }

  viewDataDialog(item: any) {
    const dialog = this.dialogService.openDialog(
      (option) => {
        option.title = 'Xem thông tin menu';
        option.size = DialogSize.xlarge;
        option.component = MenuDataDialogComponent;
        option.inputs = {
          id: item.id,
          data: item,
          mode: DialogMode.view
        };
      },
      (eventName, eventValue) => {
        if (eventName === 'onClose') {
          this.dialogService.closeDialogById(dialog.id);
          if (eventValue) {
            this.getData();
          }
        }
      }
    );
  }

  updateDataDialog(item: any) {
    const dialog = this.dialogService.openDialog(
      (option) => {
        option.title = 'Sửa thông tin menu';
        option.size = DialogSize.xlarge;
        option.component = MenuDataDialogComponent;
        option.inputs = {
          id: item.id,
          data: item,
          mode: DialogMode.edit
        };
      },
      (eventName, eventValue) => {
        if (eventName === 'onClose') {
          this.dialogService.closeDialogById(dialog.id);
          if (eventValue) {
            this.getData();
          }
        }
      }
    );
  }

  async deleteData(item: any) {
    const confirm = await this.messageService.confirm('Bạn có chắc chắn muốn xóa dữ liệu này?');
    if (!confirm) return;
    this.dialogService.openLoading();
    // await this.menuService.delete(item.id).firstValueFrom();
    this.messageService.showNotification('Đã xóa dữ liệu thành công');
    this.getData();
    this.dialogService.closeLoading();
  }
}
