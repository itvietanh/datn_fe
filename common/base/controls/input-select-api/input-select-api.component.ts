// tslint:disable-next-line:max-line-length
import {
  Component,
  OnInit,
  ViewEncapsulation,
  forwardRef,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnDestroy,
  ChangeDetectorRef,
  TemplateRef,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { PagedListModel, PagingModel, ResponseModel } from 'share';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'input-select-api',
  templateUrl: './input-select-api.component.html',
  styleUrls: ['./input-select-api.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputSelectApiComponent),
      multi: true,
    },
  ],
})
export class InputSelectApiComponent
  implements OnInit, OnDestroy, ControlValueAccessor, OnChanges {
  @Input() classControl: any = '';
  @Input() placeholder: any = '';
  @Input() apiService: any;
  @Input() menuService: any;
  @Input() actionName: string | undefined;
  @Input() apiParams: any = {};
  @Input() disabled = false;
  @Input() hidden = false;
  @Input() readonly = false;
  @Input() allowClear = true;
  @Input() allowSearch = true;
  @Input() items: any[] = [];
  @Input() autoSelectFirst = false;
  @Input() view: boolean | undefined;
  @Input() template: number | undefined;
  @Input() addOnAfterTemplate?: TemplateRef<void>;

  @Input() refesh = false;
  @Output() refeshChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output('onChange') eventOnChange = new EventEmitter<any>();

  public inputValue: any;
  public controlValue: any | null = null;
  public isLoading = false;
  public isInit = false;
  public listOption: any[] = [];
  public listItemBonus: any[] = [];
  public searchChange$ = new BehaviorSubject('');
  public searchLength = 0;
  public pageChange$ = new BehaviorSubject(1);
  public refeshDataChange$ = new BehaviorSubject<boolean | null>(null);
  public textSearchOld: string | undefined;
  public paging: PagingModel = {
    page: 1,
    size: 20,
    total: 0,
  };
  public noData = false;
  private searchChange: any;
  private pageChange: any;
  private refeshDataChange: any;
  public apiParamsJSon: string = '';

  eventBaseChange = (_: any) => { };
  eventBaseTouched = () => { };

  constructor(private cdr: ChangeDetectorRef) { }

  getApiCombobox(param: any): Observable<ResponseModel<PagedListModel>> {
    return this.apiService[this.actionName!](param);
  }

  ngOnInit(): void {
    if (!this.actionName) {
      this.actionName = 'getCombobox';
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
        this.searchLength = textSearch.length;
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
          this.getData(page, this.searchChange$.value);
        }
      });

    this.refeshDataChange = this.refeshDataChange$
      .asObservable()
      .pipe(debounceTime(500))
      .subscribe((value) => {
        if (value !== null) {
          this.getData(1, this.searchChange$.value);
        }
      });
  }

  ngOnDestroy(): void {
    this.searchChange.unsubscribe();
    this.pageChange.unsubscribe();
    this.refeshDataChange.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes['apiParams'] && !changes['apiParams'].firstChange) ||
      (changes['apiService'] && !changes['apiService'].firstChange)
    ) {
      this.listOption = [];
      this.noData = false;

      this.refeshDataChange$.next(!this.refeshDataChange$.value);

      const listTask = [this.checkItemBonus()];
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
        this.refeshDataChange$.next(!this.refeshDataChange$.value);
      }
    }

    if (changes['refesh']?.currentValue === true) {
      this.refeshChange.emit(false);
      this.getData(1, this.searchChange$.value);
    }
  }

  loadMore(): void {
    const pageNew = this.paging.page! + 1;

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
      countable: false,
    };
    this.paging.page = page;
    params.page = page;

    const rs = await this.getApiCombobox(params).firstValueFrom();
    if (page === 1) {
      //clear data
      this.listOption = [];
    }

    if (!rs.errors) {
      if (!rs.data) {
        this.noData = true;
        this.isLoading = false;
        return;
      }

      if (!rs.data.meta.hasNextPage) {
        this.noData = true;
      }

      if (rs.data.items.length > 0) {
        const valueData = [];
        for (const item of rs.data.items) {
          let listsource = [];
          if (textSearch) {
            listsource = [...this.items, ...this.listOption];
          } else {
            listsource = [
              ...this.items,
              ...this.listItemBonus,
              ...this.listOption,
            ];
          }
          if (
            listsource.findIndex((x) =>
              this.deepCompare(x.value, item.value)
            ) === -1
          ) {
            valueData.push({ ...item, value: item.value, label: item.label });
          }
        }
        this.listOption = [...this.listOption, ...valueData];
        if (!textSearch) {
          //check select default
          const listDataCheck = [...this.listItemBonus, ...this.listOption];
          if (
            this.autoSelectFirst === true &&
            !this.controlValue &&
            listDataCheck.length > 0
          ) {
            this.controlValue = listDataCheck[0].value;
            this.eventBaseChange(this.controlValue);
            this.eventOnChange.emit(listDataCheck[0]);
          }
        }
      }
    }
    this.isLoading = false;
  }

  onSearch(value: string): void {
    if (this.searchChange$.value !== value) {
      this.searchChange$.next(value);
    }
  }

  onSearchKyUp(key: any): void {
    let value: string = key.currentTarget.value;
    this.onSearch(value);
  }

  writeValue(obj: any): void {
    this.controlValue = obj;
    this.isInit = false;
    this.checkItemBonus().then(() => {
      this.isInit = true;
      this.cdr.detectChanges();
    });
  }

  async checkItemBonus(): Promise<void> {
    this.listItemBonus = [];
    if (this.controlValue) {
      const checkExits = [...this.items, ...this.listOption].findIndex((x) =>
        this.deepCompare(x.value, this.controlValue)
      );
      if (checkExits === -1) {
        const params = {
          ...this.apiParams,
          page: 1,
          size: 1,
          values: [this.controlValue].join(','),
          countable: false,
        };
        const rs = await this.getApiCombobox(params).firstValueFrom();
        if (!rs.errors && rs.data) {
          const valueData = [];
          // tslint:disable-next-line: forin
          for (const item of rs.data.items) {
            if (
              [...this.items, ...valueData, ...this.listOption].findIndex((x) =>
                this.deepCompare(x.value, item.value)
              ) === -1
            ) {
              valueData.push({
                ...item,
                value: this.controlValue,
                label: item.label,
              });
            }
          }
          this.listItemBonus = valueData;
        }
      } else {
        this.controlValue = [...this.items, ...this.listOption][
          checkExits
        ].value;
      }
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
    if (this.template === 2) {
      this.inputValue = '';
      this.getData();
    }
    this.controlValue = null;
    this.eventBaseChange(this.controlValue);
    this.eventOnChange.emit(this.controlValue);
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (!isDisabled && this.listOption.length === 0 && !this.isLoading) {
      this.refeshDataChange$.next(!this.refeshDataChange$.value);
    }
  }

  clickSelectItem(value: any) {
    this.controlValue = value;
    this.onChange();
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
}
