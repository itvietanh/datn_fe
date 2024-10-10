import { DialogService } from './../../common/share/src/service/base/dialog.service';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MessageService } from 'common/base/service/message.service';
import { ACCESS_TOKEN_KEY, LocalStorageUtil } from 'common/base/utils';
import { AutService } from 'common/share/src/service/application/auth/aut.service';
import { SettingService } from 'share';

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.scss'],
})
export class SystemComponent implements OnInit {
  constructor(
    private messageService: MessageService,
    private settingService: SettingService,
    private title: Title,
  ) {}

  ngOnInit() {
    // this.checkVersion();
  }

  private clientName = 'task';
  async checkVersion() {
    const vsClient = this.settingService.getVersionClient(this.clientName);
    if (this.settingService.version.shell !== vsClient) {
      await this.messageService.alert(
        'Tài nguyên web đang ở phiên bản thấp hơn phía máy chủ! Vui lòng ấn đồng ý hoặc (ctrl + F5) để tải lại tài nguyên.',
        null
      );
      this.title.setTitle(
        this.title.getTitle() + ' v:' + this.settingService.version.shell
      );
      location.reload();
    }
  }
}
