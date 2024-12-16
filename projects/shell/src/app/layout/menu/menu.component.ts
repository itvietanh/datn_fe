import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';
import { MenuService } from 'common/share/src/service/application/hotel/menu.service';
import { MessageService } from 'common/base/service/message.service';
import { AutService } from 'common/share/src/service/application/auth/aut.service';

declare let $: any;
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  encapsulation: ViewEncapsulation.None, //Mo khoa scss cho phep scss se anh huong tat ca component
})
export class MenuComponent implements OnInit {
  public menuData: any[] = [];
  public isShowFullMenuMobile = false;
  public isLoading = true;
  private role: any;

  constructor(private rt: Router, private location: Location, private menuService: MenuService, private messageService: MessageService, private autService: AutService) { }

  async ngOnInit(): Promise<void> {
    await this.autService.initUser();
    this.role = await this.autService.userInfo;
    this.role = await this.role.authorizal[0].role;

    const url = this.location.path();
    // gọi lần đầu
    this.getDataMenu(url);

    // goi khi thay doi url
    this.rt.events
      .pipe(filter((x) => x instanceof NavigationEnd))
      .subscribe((x: any) => {
        // gọi khi thay đổi url
        this.getDataMenu(x.url);
      });

    this.resizeDocument();
  }

  async getData(): Promise<void> {
    this.isLoading = true;
    const rs = await this.menuService.getPaging().firstValueFrom();
    if (rs.data?.items) {
      let dataRaw = rs.data.items.map(x => {
        return {
          id: x.id,
          icon: x.icon,
          name: x.name,
          url: x.url,
          parentId: x.parentUid,
          // params: x.queryParams ? JSON.parse(x.queryParams) : null,
          isOpen: false,
          exact: true,
          child: [],
        };
      });

      // convert data to tree
      // debugger;
      dataRaw.forEach((item: any) => {
        item.child = dataRaw.filter(x => x.parentId === item.id);
      });

      const convertData = dataRaw.filter(x => x.parentId === null);
      this.menuData = convertData;
      // debugger;
    } else {
      this.messageService.notiMessageError(rs.errors);
    }
    this.isLoading = false;
  }

  async getDataMenu(url: string): Promise<void> {
    // if (environment.sso) {
    // await this.getMenuByApi();
    // } else {
    // this.getData();
    this.getMenuDefault();
    // }
    this.isLoading = false;
    this.clearActiveMenu(this.menuData);
    this.autoOpenMenuByUrl(this.menuData, url);
    console.log('menuData', this.menuData);
  }

  async getMenuByApi() {
    // const dataRaw = this.menuService.listMenu.map((x) => ({
    //   id: x.id,
    //   parent: x.parentUid,
    //   code: x.code,
    //   icon: x.icon,
    //   name: x.name,
    //   url: x.url,
    //   isOpen: false,
    //   exact: false,
    //   child: [],
    //   level: 0,
    // }));
    // if (!dataRaw) return;
    // dataRaw.forEach((item: any) => {
    //   item.child = dataRaw.filter((x) => x.parent === item.id);
    // });
    // const result = dataRaw.filter((x) => x.parent === null);
    // this.setMenuLevel(result);
    // this.menuData = result;
  }

  setMenuLevel(data: any[]) {
    for (const item of data) {
      if (item.child.length > 0) {
        for (const c of item.child) {
          c.level = item.level + 1;
        }
        this.setMenuLevel(item.child);
      }
    }
  }

  // mapingDataApi(data: any[]) {
  //   for (const item of data) {
  //     item.url = item.parentId ? item.path : null;
  //     item.child = item.children;
  //     if (item.children && item.children.length > 0) {
  //       this.mapingDataApi(item.children);
  //     }
  //   }
  // }

  getMenuDefault() {
    const menuData = [
      {
        icon: 'isax-house1',
        name: 'ĐẶT PHÒNG',
        url: '/he-thong/dat-phong',
        isOpen: false,
        exact: false,
        level: 1,
        child: [],
        roles: ['ADMIN', "EMPLOYEE"],
      },
      {
        icon: 'isax-home-hashtag1',
        name: 'SƠ ĐỒ KHÁCH SẠN',
        url: '/he-thong/trang-chu',
        isOpen: false,
        exact: false,
        level: 1,
        child: [],
        roles: ['ADMIN', "EMPLOYEE"],
      },
      {
        icon: 'isax-house-2',
        name: 'QUẢN LÝ CƠ SỞ',
        url: '/he-thong/co-so',
        isOpen: false,
        exact: false,
        level: 1,
        child: [],
        roles: ['ADMIN'],
      },
      {
        icon: 'isax-profile-2user',
        name: 'QUẢN LÝ TÀI KHOẢN NHÂN VIÊN',
        url: '/he-thong/tai-khoan',
        isOpen: false,
        exact: false,
        level: 1,
        child: [
        ],
        roles: ['ADMIN'],
      },

      {
        icon: 'isax-home-hashtag1',
        name: 'QUẢN LÝ KHÁCH SẠN ',
        url: null,
        isOpen: false,
        exact: false,
        level: 1,
        child: [
          {
            icon: 'isax-keyboard',
            name: 'QUẢN LÝ TẦNG',
            url: '/he-thong/danh-sach-tang',
            isOpen: false,
            exact: false,
            level: 2,
            child: [],
            roles: ['ADMIN'],
          },
          {
            icon: 'isax-layer',
            name: 'QUẢN LÝ LOẠI PHÒNG',
            url: '/he-thong/danh-sach-loai-phong',
            isOpen: false,
            exact: false,
            level: 2,
            child: [],
            roles: ['ADMIN'],
          },
          {
            icon: 'isax-sms-edit',
            name: 'QUẢN LÝ DỊCH VỤ',
            url: '/he-thong/dich-vu',
            isOpen: false,
            exact: false,
            level: 1,
            child: [
              {
                icon: 'isax-bill',
                name: 'DỊCH VỤ',
                url: '/he-thong/dich-vu',
                isOpen: false,
                exact: false,
                level: 2,
                child: [],
                roles: ['ADMIN'],
              },
              {
                icon: 'isax-profile-tick',
                name: 'DỊCH VỤ KHÁCH ĐẶT',
                url: '/he-thong/dich-vu-khach-dat',
                isOpen: false,
                exact: false,
                level: 2,
                child: [],
                roles: ['ADMIN'],
              },
            ],
            roles: ['ADMIN'],
          }
        ],
        roles: ['ADMIN'],
      },
      {
        icon: 'isax-profile-tick',
        name: 'QUẢN LÝ KHÁCH HÀNG',
        url: '/he-thong/khach-hang',
        isOpen: false,
        exact: false,
        level: 1,
        child: [],
        roles: ['ADMIN'],
      },
      {
        icon: 'isax-grid-eraser',
        name: 'THỐNG KÊ',
        url: '/he-thong/thong-ke',
        isOpen: false,
        exact: false,
        level: 1,
        child: [
          {
            icon: 'isax-security-card',
            name: 'Giao dịch',
            url: '/he-thong/thong-ke/giao-dich',
            isOpen: false,
            exact: false,
            level: 2,
            child: [],
            roles: ['ADMIN'],
          },
          {
            icon: 'isax-shopping-bag',
            name: 'Dịch vụ',
            url: '/he-thong/thong-ke/bao-cao',
            isOpen: false,
            exact: false,
            level: 2,
            child: [],
            roles: ['ADMIN'],
          },
          {
            icon: 'isax-tag-user',
            name: 'Khách hàng',
            url: '/he-thong/thong-ke/khach-hang',
            isOpen: false,
            exact: false,
            level: 2,
            child: [],
            roles: ['ADMIN'],
          },
          {
            icon: 'isax-user-tag',
            name: 'Nhân viên',
            url: '/he-thong/thong-ke/nhan-vien',
            isOpen: false,
            exact: false,
            level: 2,
            child: [],
            roles: ['ADMIN'],
          },
          {
            icon: 'isax-video-horizontal',
            name: 'Loại phòng',
            url: '/he-thong/thong-ke/loai-phong',
            isOpen: false,
            exact: false,
            level: 2,
            child: [],
            roles: ['ADMIN'],
          },
        ],
        roles: ['ADMIN'],
      },
      {
        icon: 'isax-cpu-setting',
        name: 'QUẢN LÝ MENU',
        url: '/he-thong/menu',
        isOpen: false,
        exact: false,
        level: 1,
        child: [],
        roles: ['ADMIN'],
      },
      {
        icon: 'isax-refresh-left-square1',
        name: 'LỊCH SỬ',
        url: '/he-thong/lich-su',
        isOpen: false,
        exact: false,
        level: 1,
        child: [],
        roles: ['ADMIN'],
      },
      {
        icon: 'isax-verify',
        name: 'QUẢN LÝ QUYỀN',
        url: '/he-thong/quyen',
        isOpen: false,
        exact: false,
        level: 1,
        child: [],
        roles: ['ADMIN'],
      },
    ];
    this.menuData = this.filterMenuByRole(menuData, this.role);
  }

  filterMenuByRole(menu: any[], role: string): any[] {
    return menu
      .filter((item) => item.roles.includes(role))
      .map((item) => ({
        ...item,
        child: item.child ? this.filterMenuByRole(item.child, role) : [],
      }));
  }

  clearActiveMenu(source: any[]) {
    for (const item of source) {
      item.isOpen = false;
      if (item.child.length > 0) {
        this.clearActiveMenu(item.child);
      }
    }
  }

  private autoOpenMenuByUrl(
    source: any[],
    url: string,
    level: number = 0
  ): boolean {
    let result = false;
    for (const item of source) {
      item.level = level;
      let queryParam = '';
      if (item.params) {
        let objParams = JSON.parse(item.params);
        for (const key in objParams) {
          const value = objParams[key];
          if (queryParam.indexOf('?') === -1) {
            queryParam += '?';
          } else {
            queryParam += '&';
          }
          queryParam += `${key}=${value}`;
        }
      }

      if (item.child.length > 0) {
        const rs = this.autoOpenMenuByUrl(item.child, url, level + 1);
        if (rs) {
          item.isOpen = true;
          result = rs;
        }
      } else if (`${item.url}${queryParam}` === url) {
        result = true;
      }
    }
    return result;
  }

  public openMenu(value: any): void {
    value.isOpen = !value.isOpen;
  }

  public resizeDocument(): void {
    //if (window.screen.width <= 1366) {
    $('body').toggleClass('sidebar-xs').removeClass('sidebar-mobile-main');
    // }
  }

  public hideMenuMobile() {
    $('body').removeClass('sidebar-mobile-main');
    this.isShowFullMenuMobile = false;
  }

  public showFullMenuMobile() {
    this.isShowFullMenuMobile = !this.isShowFullMenuMobile;
  }
}
