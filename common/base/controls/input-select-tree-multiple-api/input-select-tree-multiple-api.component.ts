import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NzTreeFlatDataSource, NzTreeFlattener } from 'ng-zorro-antd/tree-view';

import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {
  PagedListModel,
  PagedListTreeModel,
  PagingModel,
  ResponseModel,
} from 'share';
import { ExtentionService } from 'common/base/service/extention.service';
declare let $: any;

@Component({
  selector: 'input-select-tree-multiple-api',
  templateUrl: './input-select-tree-multiple-api.component.html',
  styleUrls: ['./input-select-tree-multiple-api.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputSelectTreeMultipleApiComponent),
      multi: true,
    },
  ],
})
export class InputSelectTreeMultipleApiComponent
  implements OnInit, OnDestroy, ControlValueAccessor, OnChanges {
  @Input() classControl: any = '';
  @Input() placeholder: any = '';
  @Input() apiService: any;
  @Input() actionName: string | undefined;
  @Input() actionGetChildren: string | undefined;
  @Input() apiParams: any = {};
  @Input() disabled = false;
  @Input() hidden = false;
  @Input() readonly = false;
  @Input() allowClear = true;
  @Input() allowSearch = true;
  @Input() items: any[] = [];
  @Input() autoSelectFirst = false;
  @Input() onlySelectChild: boolean | undefined;
  @Input() template: number | undefined;
  @Input() view: boolean | undefined;
  @Input() reload: number | undefined = 0;
  @Input() viewTextFull: boolean | undefined;
  @Input() hiddenClickMe: boolean | undefined;
  // tslint:disable-next-line:no-output-rename
  @Output('onChange') eventOnChange = new EventEmitter<any>();

  // tslint:disable-next-line:member-ordering
  public controlValue: any[] | null | undefined = [];
  public controlText: string | null | undefined = '';
  public controlTextArray: string[] = [];
  public textSearch: string = '';
  public isLoading = false;
  public isInit = false;
  public listOption: any[] = [];
  public listItemBonus: any[] = [];
  public searchChange$ = new BehaviorSubject('');
  public searchLength = 0;
  public pageChange$ = new BehaviorSubject(1);
  public textSearchOld: string | undefined;
  public paging: PagingModel = {
    page: 1,
    size: 20,
    total: 0,
  };
  public noData = false;
  private searchChange: any;
  private pageChange: any;
  public apiParamsJSon: string = '';

  public isOpenDrop: boolean = false;
  public treeData: TreeNode[] = [];
  public idSearch = this.ex.newGuid();
  public idDrop = this.ex.newGuid();
  public setSelectFirst: boolean = false;

  eventBaseChange = (_: any) => { };
  eventBaseTouched = () => { };

  constructor(private cdr: ChangeDetectorRef, private ex: ExtentionService) {
    this.dataSource.setData(this.treeData);
  }

  getApiCombobox(param: any): Observable<ResponseModel<PagedListTreeModel>> {
    return this.apiService[this.actionName!](param);
  }

  getApiChildren(param: any): Observable<ResponseModel<PagedListModel>> {
    return this.apiService[this.actionGetChildren!](param);
  }

  ngOnInit(): void {
    if (!this.actionName) {
      this.actionName = 'getCombobox';
    }

    if (!this.actionGetChildren) {
      this.actionGetChildren = 'getCombobox';
    }

    if (!this.placeholder) {
      this.placeholder = '-- Chọn --';
    }

    if (this.apiParams) {
      this.apiParamsJSon = JSON.stringify(this.apiParams);
    }

    if (!this.template) {
      this.template = 1;
    }

    this.searchChange = this.searchChange$
      .asObservable()
      .pipe(debounceTime(500))
      .subscribe((textSearch) => {
        // console.log('searchChange', textSearch);
        this.searchLength = textSearch.length;
        if (this.searchLength > 0 && this.searchLength < 3) return;
        this.listOption = [];
        this.noData = false;
        if (!this.disabled) {
          this.getData(1, textSearch);
        }
      });
    this.pageChange = this.pageChange$
      .asObservable()
      .pipe(debounceTime(500))
      .subscribe((page) => {
        if (page > 1) {
          //console.log('pageChange', page);
          this.getData(page, this.searchChange$.value);
        }
      });
  }

  ngOnDestroy(): void {
    this.searchChange.unsubscribe();
    this.pageChange.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes['apiParams'] && !changes['apiParams'].firstChange) ||
      (changes['apiService'] && !changes['apiService'].firstChange)
    ) {
      this.listOption = [];
      this.noData = false;

      const listTask = [this.getData(1, ''), this.checkItemBonus()];
      this.isInit = false;
      Promise.all(listTask).then(() => {
        this.isInit = true;
        this.cdr.detectChanges();
      });
    }

    if (changes['disabled'] && !changes['disabled'].firstChange) {
      if (
        !changes['disabled'].currentValue &&
        this.listOption.length === 0 &&
        !this.isLoading
      ) {
        this.getData(1, this.searchChange$.value);
      }
    }

    if (changes['reload']) {
      this.getData(1, '');
    }
  }

  loadMore(): void {
    const pageNew = this.paging.page! + 1;
    // console.log('loadMore',pageNew + '/' + this.noData + '/' + this.isLoading + '/'+ this.pageChange.value);

    if (!this.noData && !this.isLoading && this.pageChange.value !== pageNew) {
      this.pageChange.next(pageNew);
    }
  }

  covertArrStr(textSearch: string) {
    const cipherChars = [...textSearch]; // convert into array
    for (let item of cipherChars) {
      const index = cipherChars.findIndex((x) => x === '%');
      if (index != -1) {
        cipherChars[index] = '//$';
      }
    }
    textSearch = cipherChars.join(''); // convert back into string
    return textSearch;
  }

  async getData(page: number = 1, textSearch: string = ''): Promise<void> {
    textSearch = this.covertArrStr(textSearch);
    this.isLoading = true;
    const params = {
      ...this.paging,
      ...this.apiParams,
      q: textSearch.trim(),
      countable: false
    };
    this.paging.page = page;
    params.page = 1;
    if (textSearch) {
      params.size = 500;
    } else {
      params.size = 20;
    }

    const rs = await this.getApiCombobox(params).firstValueFrom();
    if (!rs.errors) {
      if (!rs.data?.items) {
        this.noData = true;
        this.isLoading = false;
        return;
      }

      if (rs.data?.items.length === 0) {
        this.noData = true;
        this.isLoading = false;
        return;
      }

      let levelMin = 9999;
      for (const item of rs.data.items) {
        if (levelMin > item.level) levelMin = item.level;
      }

      let getMinLevel = levelMin;

      //view tree
      let dataRaw: TreeNode[] = [];

      // lay cac item dang thieu cha
      let listItemLevelMin: any[] = [];
      if (textSearch) {
        // nếu tìm kiếm thì cứ truy hết level
        getMinLevel = 1;
        for (let index = 0; index < rs.data.items.length; index++) {
          const item = rs.data.items[index];
          let hasParent = rs.data.items.find(
            (x: any) => x.value === item.parent
          );
          if (!hasParent) {
            listItemLevelMin.push(item);
          }
        }
        dataRaw = [
          ...dataRaw,
          ...JSON.parse(
            JSON.stringify(
              rs.data.items.map((x: any) => {
                return {
                  code: x.code,
                  key: x.value,
                  name: x.label,
                  parentKey: x.parent,
                  expandable: !x.isLeaf,
                  level: x.level,
                  path: x.path,
                  disabled: false,
                  loading: false,
                  open: false,
                  children: [],
                };
              })
            )
          ),
        ];
      } else {
        listItemLevelMin = rs.data.items.filter(
          (x: any) => x.level === levelMin
        );
        dataRaw = [
          ...dataRaw,
          ...JSON.parse(
            JSON.stringify(
              listItemLevelMin.map((x: any) => {
                return {
                  code: x.code,
                  key: x.value,
                  name: x.label,
                  parentKey: x.parent,
                  expandable: !x.isLeaf,
                  level: x.level,
                  disabled: false,
                  loading: false,
                  open: false,
                  children: [],
                };
              })
            )
          ),
        ];
      }

      let first = true;
      for (const item of listItemLevelMin) {
        //load all con cua 1 level thap nhat thu nhat
        if (!textSearch && first) {
          first = false;
          let rsChildren = await this.getApiChildren({
            ...this.apiParams,
            parentId: item.value,
          }).firstValueFrom();
          if (rsChildren.errors || !rsChildren.data?.items) {
            continue;
          }

          let itemChildren: TreeNode[] = rsChildren.data!.items.map(
            (x: any) => {
              return {
                code: x.code,
                key: x.value,
                name: x.label,
                parentKey: x.parent,
                expandable: !x.isLeaf,
                level: x.level,
                disabled: false,
                loading: false,
                open: false,
                children: [],
              };
            }
          );
          dataRaw = [...dataRaw, ...itemChildren];
        }
      }

      // bù đắp các parent Level min
      if (rs.data.parents.length > 0) {
        let itemParent: TreeNode[] = rs.data.parents.map((x: any) => {
          return {
            code: x.code,
            key: x.value,
            name: x.label,
            parentKey: x.parent,
            expandable: !x.isLeaf,
            level: x.level,
            disabled: true,
            loading: false,
            open: true,
            children: [],
          };
        });
        for (const item of itemParent) {
          if (dataRaw.findIndex((x) => x.key === item.key) === -1) {
            dataRaw.push(item);
          }
        }
      }

      // convert data to tree
      for (const item of dataRaw) {
        item.children = [
          ...item.children,
          ...dataRaw.filter((x) => x.parentKey === item.key),
        ];
      }

      // open các child đã được load sẵn và dánh dẫu các child có con chưa được load
      for (const item of dataRaw.filter((x) => x.expandable)) {
        if (item.children.length === 0) {
          item.open = false;
          item.loading = null;
        } else {
          item.open = true;
          item.loading = false;
        }
        //neu chi duoc chon la thi disable het ca not co child
        if (this.onlySelectChild) {
          item.disabled = true;
        }
      }

      // tinh lai level thap nhat sau khi da build data
      levelMin = 9999;
      for (const item of dataRaw) {
        if (levelMin > item.level && item.level >= getMinLevel)
          levelMin = item.level;
      }
      this.treeData = dataRaw.filter((x) => x.level === levelMin);
      // fix hiển thị khi tìm kiếm
      if (this.textSearch) {
        // this.treeData = [{
        //   key: this.ex.newGuid(),
        //   name: rs.result.paging.count! >= rs.result.paging.size! ? 'Tìm thấy hơn 500 kết quả' : `Tìm thấy ${rs.result.paging.count} kết quả`,
        //   parentKey: null,
        //   expandable: true,
        //   level: 1,
        //   path: '',
        //   disabled: true,
        //   loading: false,
        //   open: true,
        //   children: this.treeData
        // }]
      } else if (
        this.autoSelectFirst &&
        !this.setSelectFirst &&
        dataRaw.filter((x) => !x.disabled).length > 0
      ) {
        // this.setSelectFirst = true;
        // this.selectListSelection.clear();
        // this.selectListSelection.toggle(dataRaw.filter(x => !x.disabled)[0].key);
        // this.controlText = await this.showTextValue(dataRaw.filter(x => !x.disabled)[0].name, dataRaw.filter(x => !x.disabled)[0].key);
        // this.controlValue = dataRaw.filter(x => !x.disabled)[0].key;
        // this.eventBaseChange(this.controlValue);
        // this.eventOnChange.emit(this.controlValue);
      }
      // console.log('convertData', this.treeData);
      this.dataSource.setData(this.treeData);
      if (this.treeControl.dataNodes.length > 0) {
        this.expanOpen();
      }
    }
    this.isLoading = false;
  }

  expanOpen() {
    setTimeout(() => {
      for (const item of this.treeControl.dataNodes) {
        if (item.open) {
          this.treeControl.expand(item);
        }
      }
    }, 300);
  }

  onSearch(key: any): void {
    let value: string = key.currentTarget.value;
    if (this.searchChange$.value !== value) {
      this.searchChange$.next(value);
    }
  }

  writeValue(obj: any[]): void {
    this.controlValue = obj;
    this.isInit = false;
    this.checkItemBonus().then(() => {
      this.isInit = true;
      this.cdr.detectChanges();
    });
  }

  async checkItemBonus(): Promise<void> {
    this.listItemBonus = [];
    if (this.controlValue && this.controlValue.length > 0) {
      const params = {
        ...this.apiParams,
        page: 1,
        size: this.controlValue.length,
        values: this.controlValue.join(', '),
        countable: false
      };
      const rs = await this.getApiCombobox(params).firstValueFrom();
      if (!rs.errors && rs.data) {
        this.listItemBonus = rs.data.items.map((x: any) => {
          return {
            key: x.value,
            name: x.label,
            parentKey: x.parent,
            expandable: !x.isLeaf,
            level: x.level,
            path: x.path,
            disabled: false,
            loading: !x.isLeaf ? null : false,
            open: false,
            children: [],
          };
        });
        if (this.listItemBonus.length > 0) {
          this.controlTextArray.push(
            await this.showTextValue(
              this.listItemBonus[0].name,
              this.listItemBonus[0].key
            )
          );
          for (const ctv of this.controlValue) {
            this.selectListSelection.toggle(ctv);
          }
          this.controlText = this.controlTextArray.join(', ');
        }
      }
    } else {
      this.controlText = null;
    }
  }

  registerOnChange(fn: any): void {
    this.eventBaseChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.eventBaseTouched = fn;
  }

  onChange(): void {
    const valueData = [
      this.items,
      ...this.listItemBonus,
      ...this.listOption,
    ].find((x) => this.deepCompare(x.value, this.controlValue));
    this.eventBaseChange(this.controlValue);
    this.eventOnChange.emit(valueData);
  }

  onClear(): void {
    this.selectListSelection.clear();
    this.changeValue();
  }

  onClearSearch(type: number = 1) {
    this.reOpen = type;
    this.textSearch = '';
    this.searchChange$.next('');
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (!isDisabled && this.listOption.length === 0 && !this.isLoading) {
      this.getData(1, this.searchChange$.value);
    }
  }

  deepCompare(object1: any, object2: any): boolean {
    if (!object1 || !object2) {
      return false;
    }
    if (object1 instanceof Object) {
      let pass = 0;
      let check = 0;
      // tslint:disable-next-line: forin
      for (const key in object1) {
        if (object1[key] === object2[key]) {
          pass++;
        }
        check++;
      }
      return pass === check;
    } else {
      return object1 === object2;
    }
  }

  // -------------
  private transformer = (node: TreeNode, level: number): TreeNode => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.key === node.key
        ? existingNode
        : {
          code: node.code,
          key: node.key,
          parentKey: node.parentKey,
          name: node.name,
          level: level,
          loading: node.loading,
          expandable: node.expandable,
          disabled: node.disabled,
          open: node.open,
          children: node.children,
        };
    flatNode.name = node.name;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  selectListSelection = new SelectionModel<TreeNode>(true);

  treeControl = new FlatTreeControl<TreeNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener = new NzTreeFlattener(
    this.transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );

  flatNodeMap = new Map<TreeNode, TreeNode>();
  nestedNodeMap = new Map<TreeNode, TreeNode>();

  dataSource = new NzTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: TreeNode): boolean => node.expandable;

  trackBy = (_: number, node: TreeNode): string => `${node.key}-${node.name}`;

  selectItem(node: TreeNode): void {
    if (node.disabled) {
      console.error('khong the chon item bi disable');
      return;
    }
    this.selectListSelection.toggle(node);
    this.changeValue();
  }

  checkSelectAllChild(node: TreeNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return (
      descendants.length > 0 &&
      descendants
        .filter(
          (child) =>
            child.parentKey === node.key && !child.code.endsWith('_GROUP')
        )
        .every((child) => this.selectListSelection.isSelected(child))
    );
  }

  async selectAllChid(node: TreeNode) {
    const valueSelect = this.checkSelectAllChild(node);
    const descendants = this.treeControl
      .getDescendants(node)
      .filter(
        (child) =>
          child.parentKey === node.key && !child.code.endsWith('_GROUP')
      );
    if (valueSelect) {
      this.selectListSelection.deselect(...descendants);
    } else {
      this.selectListSelection.select(...descendants);
    }
    this.changeValue();
  }

  //---------------------------------

  async getChild(item: any) {
    if (item.loading !== null) {
      return;
    }
    item.loading = true;

    const parentNode = this.flatNodeMap.get(item);
    if (!parentNode) {
      return;
    }

    //load all con cua level thap nhat
    let rsChildren = await this.getApiChildren({
      ...this.apiParams,
      parentId: item.key,
    }).firstValueFrom();
    if (rsChildren.errors) {
      console.error(rsChildren.errors);
      return;
    }
    if (!rsChildren.data?.items) {
      return;
    }

    let itemChildren: TreeNode[] = rsChildren.data.items.map((x: any) => {
      return {
        code: x.code,
        key: x.value,
        name: x.label,
        parentKey: x.parent,
        expandable: !x.isLeaf,
        level: x.level,
        disabled: this.onlySelectChild ? !x.isLeaf : false,
        loading: !x.isLeaf ? null : false,
        open: false,
        children: [],
      };
    });

    for (const x of itemChildren) {
      x.children = [
        ...x.children,
        ...itemChildren.filter((x) => x.parentKey === x.key),
      ];
    }
    const convertData = itemChildren.filter((x) => x.parentKey === item.key);

    setTimeout(() => {
      parentNode.children = convertData;
      this.dataSource.setData(this.treeData);
      item.loading = false;
    }, 400);
  }

  changeVisible(value: boolean) {
    this.isOpenDrop = value;
    console.log('changeVisible', value);
    if (!this.isOpenDrop && this.reOpen === 2) {
      this.reOpen = 0;
      // this.textSearch = '';
      // if (this.textSearch !== this.searchChange$.value) {
      //   this.searchChange$.next(this.textSearch);
      // }
      setTimeout(() => {
        this.isOpenDrop = true;
        setTimeout(() => {
          $('#' + this.idSearch).focus();
        }, 100);
      }, 300);
    }
  }

  reOpen: number = 0;
  openSearch(type: number) {
    this.reOpen = type;
    if (!this.isOpenDrop) {
      this.isOpenDrop = true;
    }
    if (type === 1) {
      setTimeout(() => {
        $('#' + this.idSearch).focus();
      }, 100);
    }
  }

  async showTextValue(name: string, value: string) {
    if (this.viewTextFull) {
      //let listParentTag = [];
      // let lstPath = path.replace(`${value}_`, '').split('_');
      // for (const path of lstPath) {
      //   if (!path) continue;
      //   let index = listParentTag.findIndex(x => x === path);
      //   if (index === -1) listParentTag.push(path);
      // }
      // if (listParentTag.length > 0) {
      //   let rsParent = await this.danhmucService.getDonViSuDungCombobox({ values: listParentTag.join(','), page: 1, size: listParentTag.length }).toApiPromise();
      //   if (!rsParent.success) {
      //     console.error(rsParent.error);
      //     return;
      //   }
      //   if (!rsParent?.result?.data) return name;
      //   let textNameFull = name;
      //   for (let index = rsParent?.result?.data.length - 1; index >= 0; index--) {
      //     const item = rsParent?.result?.data[index];
      //     textNameFull += " \\ " + item.text;
      //   }
      //   return textNameFull;
      // }
      return name;
    } else {
      return name;
    }
  }

  changeValue() {
    this.controlTextArray = [];
    let listValueTemp: any[] = [];
    let listData = this.selectListSelection.selected;
    for (const item of listData) {
      this.controlTextArray.push(item.name);
      listValueTemp.push(item.key);
    }
    this.controlText = this.controlTextArray.join(', ');
    this.controlValue = listValueTemp;

    this.eventBaseChange(this.controlValue);
    this.eventOnChange.emit(this.controlValue);
  }

  closeDialog() {
    this.isOpenDrop = false;
  }
}

interface TreeNode {
  key: any;
  parentKey: any;
  name: string;
  level: number;
  loading: boolean | null;
  expandable: boolean;
  disabled: boolean;
  children: TreeNode[];
  open: boolean;
  code: string;
}
