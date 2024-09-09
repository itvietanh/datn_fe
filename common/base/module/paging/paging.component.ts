import { PlatformLocation } from '@angular/common';
import { Component, OnChanges, Input, Output, EventEmitter, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-paging',
  templateUrl: './paging.component.html',
  styleUrls: ['./paging.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PagingComponent implements OnInit, OnChanges {
  @Input() data: any;
  @Input() view = 5;
  @Input() loading: boolean | undefined;
  @Input() temp: number | undefined;
  @Input() item: any[] = [];
  @Input() changeListPage: number | undefined;
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onChange = new EventEmitter<{ page: number, size: number, order: any }>();

  public listPage = [
    { value: 100, label: '100' },
    { value: 50, label: '50' },
    { value: 20, label: '20' },
    { value: 10, label: '10' },
    { value: 1, label: '1' }
  ];

  public lstPage: number[] = [];
  public curentPage: number = 1;
  public totalPage: number = 0;
  public totalItem: number = 0;
  public itemsPerPage: number = 10;

  constructor(private location: PlatformLocation) { }

  ngOnInit(): void {
    // fix back browse load data page
    this.location.onPopState(() => {
      const page = this.getUrlParameter('page');
      if (page != null) {
        this.onChange.emit({ page: +page, size: this.itemsPerPage, order: this.data.order });
      }
    });
  }

  ngOnChanges(): void {
    if (this.changeListPage === 0) {
      this.listPage = [
        { value: 100, label: '100' },
        { value: 50, label: '50' },
        { value: 20, label: '20' },

      ];
    }
    this.lstPage = [];
    if (!this.data) { return; }
    this.curentPage = this.data.page;
    this.totalPage = Math.ceil(this.data.total / this.data.size);
    this.totalItem = this.data.total;
    this.itemsPerPage = this.data.size;

    if (this.totalPage > 0) {
      let showItem = this.view;
      if (this.totalPage < this.view) { showItem = this.totalPage; }
      // index slot curent page
      let index = this.curentPage;
      if (showItem === this.view) {
        // tslint:disable-next-line:radix
        index = showItem % 2 === 0 ? (showItem / 2) : parseInt((showItem / 2).toString()) + 1;
      }

      let fix = this.curentPage < index ? (index - this.curentPage) : 0;
      if (this.curentPage > (this.totalPage - index) && showItem === this.view) { fix = (this.totalPage - index) - this.curentPage + 1; }
      for (let i = 1; i <= showItem; i++) {
        this.lstPage.push(this.curentPage - index + i + fix);
      }
    }
  }

  onChangePage(page: number): void {
    if (page < 1) { return; }
    if (page > this.totalPage) { return; }
    this.onChange.emit({ page, size: this.itemsPerPage, order: this.data.order });
  }

  goLast(): void {
    // this.onChange.emit({ page: -1, size: this.itemsPerPage, order: this.data.order });
    this.onChange.emit({ page: this.totalPage, size: this.itemsPerPage, order: this.data.order });
  }

  changeSize(size: any) {
    this.onChange.emit({ page: 1, size: size.value, order: this.data.order });
  }

  onChangeInput(page: number): void {
    if (page < 1) {
      this.curentPage = 1;
      return;
    }
    if (page > this.totalPage) {
      this.curentPage = this.totalPage;
      return;
    }
    this.onChange.emit({ page, size: this.curentPage, order: this.data.order });
  }

  getUrlParameter(sParam: string, search: string | null = null): string | null {
    if (search == null) { search = window.location.search; }
    search = search.replace('?', '');
    // tslint:disable-next-line:prefer-const
    // tslint:disable-next-line:one-variable-per-declaration
    const sPageURL = decodeURIComponent(search);
    const sURLVariables = sPageURL.split('&');
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < sURLVariables.length; i++) {
      const sParameterName = sURLVariables[i].split('=');
      if (sParameterName[0] === sParam) {
        return sParameterName[1] === undefined ? null : sParameterName[1];
      }
    }
    return null;
  }
}
