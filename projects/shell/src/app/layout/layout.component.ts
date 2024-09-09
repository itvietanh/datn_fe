import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MessageService } from 'common/base/service/message.service';
import { filter } from 'rxjs';
import { DialogService, SettingService } from 'share';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  encapsulation: ViewEncapsulation.None, //Mo khoa scss cho phep scss se anh huong tat ca component
})
export class LayoutComponent implements OnInit, OnDestroy {
  sub: any;
  constructor(
    private rt: Router,
    private messageService: MessageService,
    public settingService: SettingService,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    // this.checkVersion();
    this.sub = this.rt.events
      .pipe(filter((x) => x instanceof NavigationEnd))
      .subscribe((x: any) => {
        // gọi khi thay đổi url dong cac dialog con dang mos
        this.dialogService.closeAllDialog();
      });
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }

  private clientName = 'shell';
  async checkVersion() {
    const vsClient = this.settingService.getVersionClient(this.clientName);
    if (this.settingService.version.shell !== vsClient) {
      await this.messageService.alert(
        'Tài nguyên web đang ở phiên bản thấp hơn phía máy chủ! Vui lòng ấn đồng ý hoặc (ctrl + F5) để tải lại tài nguyên.',
        null
      );
      location.reload();
    }
  }
}
