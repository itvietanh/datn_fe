import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CellTemplateDirective } from 'common/base/directive/cell-template.directive';
import {
  ColumnConfig,
  Pagination,
  TableQueryParams,
  OptionModel,
} from 'common/base/models';
import { ObjUtil } from 'common/base/utils';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent implements OnInit, OnChanges, AfterContentInit {
  @ContentChildren(CellTemplateDirective, {})
  cellTemplates!: QueryList<CellTemplateDirective>;
  @Input() key = 'id';
  @Input() columns: Array<ColumnConfig> = [];
  @Input() displayColumns: string[] = [];
  @Input() items: any[] = [];
  @Input() pagination: Pagination = { page: 1, size: 10, count: 0 };
  @Input() loading: boolean | null = null;
  @Input() showPagination: boolean = true;
  @Input() showCheckbox: boolean = false;
  @Input() showIndex: boolean = true;
  @Input() rowTemplate!: TemplateRef<any>;
  @Input() scrollY: string | undefined;
  @Input() scrollX: string | undefined = '1024px';
  @Input() checkedKeys: any[] = [];
  @Input() isShowFilter = false;
  @Input() selectOnlyOne = false;
  @Input() disableAllCheck = false;
  @Input() nzEllipsis = false;
  @Output() queryParams = new EventEmitter<TableQueryParams>();
  @Output() checkedKeysChange = new EventEmitter<any[]>();
  @Output() itemSelected = new EventEmitter<any[]>();
  displayedColumns: ColumnConfig[] = [];
  checked = false;
  indeterminate = false;
  setOfCheckedKeys = new Set<any>();
  lastSort?: {
    key: string;
    value: 'ascend' | 'descend' | null;
  };
  filter: { [key: string]: any } = {};
  filterOptions: { [key: string]: OptionModel[] } = {};
  scroll: any = {};
  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    if (!this.displayColumns.length) {
      this.displayedColumns = this.columns;
    }
    this.columns.forEach((column) => {
      column.filter?.options$?.subscribe((options) => {
        column.filter!.options = options;
        this.cdr.markForCheck();
      });
    });
    if (this.scrollX) {
      this.scroll = { x: this.scrollX };
    }
    if (this.scrollY) {
      this.scroll = { ...this.scroll, y: this.scrollY };
    }
  }

  ngAfterContentInit(): void {
    this.displayedColumns
      .filter((t) => t.pipe === 'template')
      ?.forEach((t) => {
        const cell = (
          this.cellTemplates.find(
            (cell) => t.key === cell.key
          ) as CellTemplateDirective
        )?.templateRef;
        t.templateColumn = cell;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { displayColumns, items, checkedKeys } = changes;
    if (displayColumns) {
      this.displayedColumns = this.displayColumns.map((key) => {
        return {
          ...this.columns.find((col) => col.key == key)!,
          templateColumn: (
            this.cellTemplates?.find(
              (cell) => key === cell.key
            ) as CellTemplateDirective
          )?.templateRef,
        };
      });
    }
    if (checkedKeys) {
      this.setOfCheckedKeys.clear();
      this.checkedKeys.forEach((key) => this.setOfCheckedKeys.add(key));
      this.refreshCheckedStatus();
    }
    if (items) {
      this.refreshCheckedStatus();
    }
  }

  onIndexChange(page: number) {
    this.queryParams.next({ page });
  }

  onSizeChange(size: number) {
    if (this.pagination.count > 10 && size > 10) {
      this.scroll = { x: this.scrollX, y: this.scrollY };
    } else {
      this.scroll = { x: this.scrollX };
    }
    this.queryParams.next({ size });
  }

  onQueryParams(params: NzTableQueryParams) {
    if (params.sort) {
      const sort = params.sort.find((x) => x.value);
      if (!sort) {
        if (!this.lastSort) return;
        return this.queryParams.next({
          sort: { key: this.lastSort.key, value: null },
        });
      }
      this.lastSort = { key: sort.key, value: sort?.value as any };
      this.queryParams.next({
        sort: this.lastSort,
      });
    }
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedKeys.add(id);
    } else {
      this.setOfCheckedKeys.delete(id);
    }
  }

  onItemChecked(id: number, checked: boolean): void {
    if (this.selectOnlyOne) {
      this.setOfCheckedKeys.clear();
    }
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus(true);
  }

  onAllChecked(value: boolean): void {
    this.items.forEach((item) => this.updateCheckedSet(item[this.key], value));
    this.refreshCheckedStatus(true);
  }

  refreshCheckedStatus(emitEvent = false): void {
    this.checked =
      this.items?.length > 0 &&
      this.items.every((item) => this.setOfCheckedKeys.has(item[this.key]));
    this.indeterminate =
      this.items?.some((item) => this.setOfCheckedKeys.has(item[this.key])) &&
      !this.checked;
    if (emitEvent) {
      this.checkedKeysChange.emit(Array.from(this.setOfCheckedKeys.values()));
    }
    this.itemSelected.emit(
      this.items.filter((data) => this.setOfCheckedKeys.has(data.id))
    );
  }

  onChangeFilter() {
    this.queryParams.next({ filter: ObjUtil.trim(this.filter) });
  }
}
