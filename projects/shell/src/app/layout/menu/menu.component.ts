import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';
import { MenuService } from 'share';

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

  constructor(
    private rt: Router,
    public menuService: MenuService,
    private location: Location
  ) {}

  async ngOnInit(): Promise<void> {
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

  // async getData(): Promise<void> {
  //   this.isLoading = true;
  //   const rs = await this.menuApi.getAllByUser(new IdentityMenuGetAllByUserQuery()).toPromise();
  //   if (rs.success) {
  //     let dataRaw = rs.result.map(x => {
  //       return {
  //         id: x.id,
  //         icon: x.icon,
  //         name: x.name,
  //         url: x.link,
  //         parentId: x.parentId,
  //         params: x.queryParams ? JSON.parse(x.queryParams) : null,
  //         isOpen: false,
  //         exact: true,
  //         child: [],
  //       };
  //     });

  //     // convert data to tree
  //     dataRaw.forEach(item => {
  //       item.child = dataRaw.filter(x => x.parentId === item.id);
  //     });

  //     const convertData = dataRaw.filter(x => x.parentId === null);
  //     this.menuData = convertData;
  //   } else {
  //     this.messageService.notiMessageError(rs.error);
  //   }
  //   this.isLoading = false;
  // }

  async getDataMenu(url: string): Promise<void> {
    // if (environment.sso) {
    // await this.getMenuByApi();
    // } else {
    this.getMenuDefault();
    // }
    this.isLoading = false;
    this.clearActiveMenu(this.menuData);
    this.autoOpenMenuByUrl(this.menuData, url);
    console.log('menuData', this.menuData);
  }

  async getMenuByApi() {
    const dataRaw = this.menuService.listMenu.map((x) => ({
      id: x.id,
      parent: x.parentUid,
      code: x.code,
      icon: x.icon,
      name: x.name,
      url: x.url,
      isOpen: false,
      exact: false,
      child: [],
      level: 0,
    }));
    if (!dataRaw) return;

    dataRaw.forEach((item: any) => {
      item.child = dataRaw.filter((x) => x.parent === item.id);
    });
    const result = dataRaw.filter((x) => x.parent === null);
    this.setMenuLevel(result);
    this.menuData = result;
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
    this.menuData = [
      {
        icon: 'isax-pen-tool-2-1',
        name: 'SƠ ĐỒ KHÁCH SẠN',
        url: '/he-thong/trang-chu',
        isOpen: false,
        exact: false,
        level: 1,
        child: [],
      },
      {
        icon: 'isax-people1',
        name: 'QUẢN LÝ KHÁCH SẠN ',
        url: null,
        isOpen: false,
        exact: false,
        level: 2,
        child: [
          {
            icon: 'isax-pen-tool-2-1',
            name: 'QUẢN LÝ TẦNG',
            url: '/he-thong/danh-sach-tang',
            isOpen: false,
            exact: false,
            level: 2,
            child: [],
          },
          {
            icon: 'isax-pen-tool-2-1',
            name: 'QUẢN LÝ LOẠI PHÒNG',
            url: '/he-thong/danh-sach-loai-phong',
            isOpen: false,
            exact: false,
            level: 2,
            child: [],
          },
          {
            icon: 'isax-pen-tool-2-1',
            name: 'QUẢN LÝ PHÒNG',
            url: '/he-thong/danh-sach-phong',
            isOpen: false,
            exact: false,
            level: 2,
            child: [],
          },
          {
            icon: 'isax-pen-tool-2-1',
            name: 'QUẢN LÝ DỊCH VỤ',
            url: '/he-thong/dich-vu',
            isOpen: false,
            exact: false,
            level: 1,
            child: [],
          },
        ],
      },
      {
        icon: 'isax-pen-tool-2-1',
        name: 'QUẢN LÝ NHÂN VIÊN',
        url: '/he-thong/nhan-vien',
        isOpen: false,
        exact: false,
        level: 1,
        child: [],
      },
      {
        icon: 'isax-pen-tool-2-1',
        name: 'BÁO CÁO & THỐNG KÊ',
        url: '/he-thong/bao-cao',
        isOpen: false,
        exact: false,
        level: 1,
        child: [],
      },
    ];
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
