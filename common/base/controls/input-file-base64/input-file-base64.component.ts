import { HttpEventType, HttpResponse } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnInit,
  Output,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';
import { InputFilePreviewComponent } from '../input-file/input-file-preview/input-file-preview.component';
import { DialogService, DialogSize } from 'share';
import { MessageService } from 'common/base/service/message.service';

@Component({
  selector: 'input-file-base64',
  templateUrl: './input-file-base64.component.html',
  styleUrls: ['./input-file-base64.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputFileBase64Component),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => InputFileBase64Component),
      multi: true,
    },
  ],
})
export class InputFileBase64Component
  implements OnInit, ControlValueAccessor, Validator
{
  @Input() className: any = '';
  @Input() placeholder: string | undefined;
  @Input() disabled = false;
  @Input() hidden = false;
  @Input() size = 1;
  @Input() folder: string | undefined;
  @Input() tempType: number | undefined = 1;
  @Input() dowload: boolean | undefined;
  @Input() allowUpload: boolean | undefined;

  @Output('onChange') eventOnChange = new EventEmitter<any>();

  public uploading = false;
  public progress: number = 0;
  public controlValue: NzUploadFile[] = [];
  public listFileDelete: NzUploadFile[] = [];
  public showUploadList = {
    showDownloadIcon: true,
    showPreviewIcon: true,
    showRemoveIcon: !this.disabled,
  };

  loading = false;
  avatarUrl?: string;
  public isallowUpload: boolean | undefined;
  private fileService: any;

  eventBaseChange = (_: any) => {};
  eventBaseTouched = () => {};

  constructor(
    private messageService: MessageService,
    private dialogService: DialogService,
    private elementRef: ElementRef,
    private renderer2: Renderer2
  ) {}

  ngOnInit() {
    if (!this.tempType) {
      this.tempType = 2;
    }
    if (!this.placeholder) {
      this.placeholder = 'Tải lên';
    }

    if (this.dowload === undefined) {
      this.dowload = true;
    }
    this.showUploadList.showDownloadIcon = this.dowload;
    if (this.allowUpload !== undefined) {
      this.isallowUpload = false;
    } else {
      this.isallowUpload = true;
    }
  }

  removeFile = (file: NzUploadFile): boolean => {
    return true;
  };

  beforeUpload = (file: NzUploadFile): boolean => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      this.messageService.error('', 'Bạn phải chọn file ảnh');
      this.addRemoveClassError(
        this.elementRef.nativeElement,
        'nz-upload',
        'error-img',
        true
      );
      // file.status = 'error';
      // this.eventBaseChange(this.getControlValue());
      // this.eventOnChange.emit(this.getControlValue());
      return false;
    } else {
      this.addRemoveClassError(
        this.elementRef.nativeElement,
        'nz-upload',
        'error-img',
        false
      );
    }
    const isLt2M = file.size! / 1024 / 1024 < 2;
    if (!isLt2M) {
      this.messageService.error('', 'Bạn phải chọn file ảnh nhỏ hơn 2M');
      this.addRemoveClassError(
        this.elementRef.nativeElement,
        'nz-upload',
        'error-img',
        true
      );
      // file.status = 'error';
      // this.controlValue = this.controlValue.concat(file);
      // this.eventBaseChange(this.getControlValue());
      // this.eventOnChange.emit(this.getControlValue());
      return false;
    } else {
      this.addRemoveClassError(
        this.elementRef.nativeElement,
        'nz-upload',
        'error-img',
        false
      );
    }

    const fileRaw: File = file as any;
    this.getBase64(fileRaw, (value: string) => {
      this.controlValue = [
        {
          uid: '123456789',
          name: 'Ảnh đại diện',
          status: 'done',
          size: 100,
          url: value,
        },
      ];

      this.eventBaseChange(this.getControlValue());
      this.eventOnChange.emit(this.getControlValue());
    });
    return false;
  };

  validate(control: AbstractControl): ValidationErrors | null {
    return null;
  }

  registerOnValidatorChange?(fn: () => void): void {}

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    reader.readAsDataURL(img);
  }

  changeFile() {
    this.eventBaseChange(this.getControlValue());
    this.eventOnChange.emit(this.getControlValue());
  }

  async writeValue(obj: string): Promise<void> {
    if (obj) {
      this.controlValue = [
        {
          uid: '123456789',
          name: 'Ảnh đại diện',
          status: 'done',
          size: 100,
          url: obj,
        },
      ];
    } else {
      this.controlValue = [];
    }
  }

  registerOnChange(fn: any) {
    this.eventBaseChange = fn;
  }

  registerOnTouched(fn: any) {
    this.eventBaseTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.showUploadList.showRemoveIcon = !isDisabled;
  }

  getControlValue() {
    if (this.controlValue.filter((x) => x.status === 'done').length === 0)
      return null;
    return this.controlValue.filter((x) => x.status === 'done')[0].url;
  }

  // customer
  previewImage: string | undefined = '';
  previewVisible = false;
  handlePreview = async (file: NzUploadFile) => {
    this.previewVisible = true;

    const dialog = this.dialogService.openDialog(
      (option) => {
        option.title = file.name;
        option.size = DialogSize.medium;
        option.component = InputFilePreviewComponent;
        option.inputs = {
          url: file.url,
        };
      },
      (eventName, eventValue) => {
        if (eventName === 'onClose') {
          this.dialogService.closeDialogById(dialog.id);
        }
      }
    );
  };

  addRemoveClassError(
    eleRef: ElementRef,
    selector: string,
    className: string,
    isAdd: boolean
  ) {
    let item = this.renderer2.parentNode(eleRef);
    let html = item.querySelector(selector);
    if (isAdd) {
      this.renderer2.addClass(html, className);
    } else {
      this.renderer2.removeClass(html, className);
    }
  }
}
