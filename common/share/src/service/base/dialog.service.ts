import { debounceTime } from 'rxjs/operators';
import { Injectable, EventEmitter } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { BehaviorSubject } from 'rxjs';
import { NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import {MatSnackBar} from '@angular/material/snack-bar'
import {
  DialogConfigModal,
  DialogModal,
  DialogModalDrawer,
} from '../../model/dialog-model';

declare let $: any;

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  open(message:string, type:'success'|'error'){
    this.snackBar.open(message,'',{
      duration:3000,
      panelClass: type === 'success'?'snackbar-success':'snackbar-error'
    })
  }
  public listDialog: DialogModal<any>[] = [];
  private listDialogDrawer: DialogModalDrawer<any>[] = [];
  public isCloseLoading = new BehaviorSubject<any>(false);
  public infoImport = new BehaviorSubject<any>(null);
  public percentDone = new BehaviorSubject<number>(0);

  public loadingChange = new BehaviorSubject<number | null>(null);
  private loadingId: boolean = false;

  constructor(
    private snackBar:MatSnackBar,
    private modalService: NzModalService,
    private drawerService: NzDrawerService
  ) {
    this.loadingChange.asObservable().subscribe((x) => {
      if (x === null) return;
      if (x > 0 && !this.loadingId) {
        this.loadingId = true;
        $('body').addClass('open-loading');
      }
    });
    this.loadingChange
      .asObservable()
      .pipe(debounceTime(500))
      .subscribe((x) => {
        if (x === null) return;
        if (x === 0 && this.loadingId) {
          this.loadingId = false;
          setTimeout(() => {
            if (this.loadingChange.value === 0) {
              $('body').removeClass('open-loading');
            }
          }, 500);
        }
      });
  }

  public openDialog(
    options: (options: DialogConfigModal) => void,
    onEmitEvent: (eventName: string, eventValue: any) => void
  ) {
    const optionParams = {}; // Vi du voi tham so truyen vao
    const modalConfig: DialogConfigModal = {
      size: DialogSize.medium,
      component: null,
      inputs: {},
      title: '',
      escClose: false,
      class: '',
      bodyClass: '',
      viewContainerRef: null,
      maskClosable: false,
      zIndex: 1000,
      ...optionParams,
    };
    if (options) {
      options(modalConfig);
    }

    // create dialog
    const modal: NzModalRef<any> = this.modalService.create({
      nzTitle: modalConfig.title,
      nzContent: modalConfig.component,
      nzComponentParams: modalConfig.inputs,
      nzClosable: false,
      nzKeyboard: modalConfig.escClose,
      nzMaskClosable: modalConfig.maskClosable,
      nzFooter: null,
      nzClassName: `${modalConfig.size} ${modalConfig.class}`,
      nzViewContainerRef: modalConfig.viewContainerRef,
      nzZIndex: modalConfig.zIndex,
    });

    //if (modalConfig.size === DialogSize.tab) {
    if (!modalConfig.bodyClass) modalConfig.bodyClass = '';
    modalConfig.bodyClass += modalConfig.bodyClass
      ? ' '
      : '' + 'body-dialog-tab';
    //}

    if (modalConfig.bodyClass) {
      let instan: any = modal.containerInstance;
      $(instan.modalElementRef.nativeElement)
        .parents('.cdk-overlay-container')
        .addClass(modalConfig.bodyClass);
    }

    // create dialog data
    const guidId = Date.now();
    const dialogData = {
      id: guidId,
      dialog: modal,
      bodyClass: modalConfig.bodyClass,
    };

    this.listDialog.push(dialogData);
    // subscribe Event
    if (onEmitEvent) {
      for (const keyName in modal.componentInstance) {
        if (modal.componentInstance[keyName] instanceof EventEmitter) {
          modal.componentInstance[keyName].subscribe((value: any) => {
            onEmitEvent(keyName, value);
          });
        }
      }
    }
    return dialogData;
  }

  public openDialogDrawer(
    options: (options: DialogConfigModal) => void,
    onEmitEvent: (eventName: string, eventValue: any) => void
  ) {
    const modalConfig: DialogConfigModal = {
      size: DialogSize.medium,
      component: null,
      inputs: {},
      title: '',
      escClose: false,
      class: '',
      bodyClass: '',
      viewContainerRef: null,
      maskClosable: false,
      zIndex: 1000,
    };
    if (options) {
      options(modalConfig);
    }

    // create dialog
    const modal: NzDrawerRef<any> = this.drawerService.create({
      nzTitle: modalConfig.title,
      nzContent: modalConfig.component,
      nzContentParams: modalConfig.inputs,
      nzClosable: false,
      nzKeyboard: modalConfig.escClose,
      nzMaskClosable: modalConfig.maskClosable,
      nzWrapClassName: `${modalConfig.size} ${modalConfig.class}`,
      nzZIndex: modalConfig.zIndex,
    });

    if (modalConfig.bodyClass) {
      $('body').addClass(modalConfig.bodyClass);
    }

    // create dialog data
    const guidId = Date.now();
    const dialogData = {
      id: guidId,
      dialog: modal,
      bodyClass: modalConfig.bodyClass,
    };
    this.listDialogDrawer.push(dialogData);

    const outSide: any = modal;
    const lstSub: any[] = [];
    modal.afterOpen.subscribe(() => {
      // subscribe Event
      if (onEmitEvent) {
        const ci: any = outSide.componentInstance;
        for (const keyName in ci) {
          if (ci[keyName] instanceof EventEmitter) {
            lstSub.push(
              ci[keyName].subscribe((value: any) => {
                onEmitEvent(keyName, value);
              })
            );
          }
        }
      }
    });

    modal.afterClose.subscribe(() => {
      for (const desSub of lstSub) {
        desSub.unsubscribe();
      }
    });

    return dialogData;
  }

  public closeDialogById(id: number) {
    const index = this.listDialog.findIndex((x) => x.id === id);
    if (index !== -1) {
      let dialogData: any = this.listDialog[index];
      dialogData.dialog.destroy();
      if (dialogData.bodyClass) {
        $('body').removeClass(dialogData.bodyClass);
      }
      this.listDialog.splice(index, 1);
    }
  }

  public closeDialogDrawerById(id: number) {
    const index = this.listDialogDrawer.findIndex((x) => x.id === id);
    if (index !== -1) {
      let dialogData: any = this.listDialogDrawer[index];
      dialogData.dialog.close();
      if (dialogData.bodyClass) {
        $('body').removeClass(dialogData.bodyClass);
      }
      this.listDialogDrawer.splice(index, 1);
    }
  }

  public closeAllDialog() {
    while (this.listDialog.length > 0) {
      let dialog = this.listDialog[0];
      this.closeDialogById(dialog.id);
    }
  }

  public openLoading(cancel: any = null) {
    let valueCurent = this.loadingChange.value;
    if (valueCurent === null) valueCurent = 0;
    valueCurent++;
    this.loadingChange.next(valueCurent);
  }

  public closeLoading() {
    let valueCurent = this.loadingChange.value;
    if (!valueCurent) return;
    valueCurent--;
    this.loadingChange.next(valueCurent);
  }
}

export enum DialogSize {
  small = 'dialog-ms',
  medium = 'dialog-md',
  large = 'dialog-lg',
  xlarge = 'dialog-max-lg',
  xxl_large = 'dialog-max-xxl-lg',
  full = 'dialog-full',
  tab = 'dialog-tab',
}

export enum DialogMode {
  view = 'view',
  add = 'add',
  edit = 'edit',
  modify = 'modify',
  apply = 'apply',
  confirm = 'dialog-full',
  next = 'next',
  accept = 'accept',
  cancel = 'cancel',
  delete = 'delete',
  destroy = 'destroy',
  print = 'print',
  dowload = 'dowload',
  viewHistory = 'viewHistory',
  quickAdd = 'quickAdd',
}

export enum DialogConfirmMode {
  alert = 'alert',
  delete = 'delete',
}
