import { NzDrawerRef } from "ng-zorro-antd/drawer";
import { NzModalRef } from "ng-zorro-antd/modal";

export interface DialogModal<T> {
  id: number;
  dialog: NzModalRef<T>;
}

export interface DialogModalDrawer<T> {
  id: number;
  dialog: NzDrawerRef<T>;
}

export interface DialogConfigModal {
  title: string,
  size: string;
  component: any;
  inputs: any;
  escClose: boolean;
  class: string;
  bodyClass: string;
  viewContainerRef: any;
  maskClosable: boolean;
  zIndex: number;
}
