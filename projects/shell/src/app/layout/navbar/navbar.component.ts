import { LocationStrategy } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { MessageService } from 'common/base/service/message.service';
import { LocalStorageUtil } from 'common/base/utils';
import { Observable } from 'rxjs';
import {
  AccommodationFacilityService,
  DialogService,
  NotificationService,
  PagingModel,
} from 'share';

declare let $: any;
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  encapsulation: ViewEncapsulation.None, //Mo khoa scss cho phep scss se anh huong tat ca component
})
export class NavbarComponent implements OnInit {
  public userName: Observable<string> | undefined;
  public listOffice: any[] = [];
  public listNotification: any[] = [];
  public listAccom: any[] = [];
  public accomId: any;
  public isLoading: boolean | null = true;
  public curentOffice: any;
  public dropdownOpen: boolean = false;
  public paging?: PagingModel;

  constructor(
    private messageService: MessageService,
    private notificationService: NotificationService,
    private accommodationFacilityService: AccommodationFacilityService,
    private local: LocationStrategy
  ) {}

  async ngOnInit() {
  }

  resizeMenu() {
    if ($('body').hasClass('sidebar-xs')) {
      $('body').removeClass('sidebar-xs');
    } else {
      $('body').addClass('sidebar-xs');
    }
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 1);
  }

  showMenuMobile() {
    if ($('body').hasClass('sidebar-mobile-main')) {
      $('body').removeClass('sidebar-mobile-main');
    } else {
      $('body').addClass('sidebar-mobile-main');
    }
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 1);
  }

  async getNotify(paging: PagingModel = { page: 1, size: 20 }) {
   
  }

  loadMore = async () => {
    if (this.isLoading || this.isLoading === null) {
      return;
    }
    this.isLoading = true;
    this.paging!.page!++;
  };
}
