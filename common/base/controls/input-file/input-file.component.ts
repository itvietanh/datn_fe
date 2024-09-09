import { InputFilePreviewComponent } from './input-file-preview/input-file-preview.component';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Inject,
  Input,
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
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { MessageService } from 'common/base/service/message.service';
import { DialogService, DialogSize, FILE_BASE_URL, ResponseModel } from 'share';
import { Observable } from 'rxjs';

const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

@Component({
  selector: 'input-file',
  templateUrl: './input-file.component.html',
  styleUrls: ['./input-file.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputFileComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => InputFileComponent),
      multi: true,
    },
  ],
})
export class InputFileComponent
  implements OnInit, AfterViewInit, ControlValueAccessor, Validator
{
  @Input() className: any = '';
  @Input() placeholder: string | undefined;
  @Input() disabled = false;
  @Input() hidden = false;
  @Input() size = 8;
  @Input() folder: string | undefined;
  @Input() tempType: number | undefined = 1;
  @Input() fileType: string | undefined;
  @Input() dowload: boolean | undefined;
  @Input() allowUpload: boolean | undefined;
  @Input() fileSize: number | undefined;
  @Input() isViewUpLoad: boolean | undefined;
  @Input() typeUpload: string | undefined;

  @Input() apiService: any;
  @Input() actionUploadName: string | undefined;
  @Input() actionDownloadName: string | undefined;

  @Output('onChange') eventOnChange = new EventEmitter<any>();

  public uploading = false;
  public progress: number = 0;
  public controlValue: NzUploadFile[] = [];
  public listFileDelete: NzUploadFile[] = [];
  public type: string = '';
  public showUploadList = {
    showDownloadIcon: true,
    showPreviewIcon: true,
    showRemoveIcon: !this.disabled,
  };
  public isallowUpload: boolean | undefined;
  public isLoadDone = false;
  public limitSizeFileUpload = 50000000;
  eventBaseChange = (_: any) => {};
  eventBaseTouched = () => {};

  constructor(
    private dialogService: DialogService,
    private messageService: MessageService,
    private elementRef: ElementRef,
    private renderer2: Renderer2,
    @Inject(FILE_BASE_URL) protected fileBaseUrl: string
  ) {}

  uploadFile(param: any): Observable<ResponseModel<any>> {
    return this.apiService[this.actionUploadName!](param);
  }

  downloadFile(param: any): Observable<ResponseModel<any>> {
    return this.apiService[this.actionDownloadName!](param);
  }

  ngOnInit() {
    if (!this.tempType) {
      this.tempType = 1;
    }
    if (!this.placeholder) {
      this.placeholder = 'Tải file lên';
    }
    if (this.dowload === undefined) {
      this.dowload = true;
    }

    if (!this.actionUploadName) {
      this.actionUploadName = 'upload';
    }

    if (!this.actionDownloadName) {
      this.actionDownloadName = 'dowload';
    }

    this.showUploadList.showDownloadIcon = this.dowload;
    if (this.allowUpload !== undefined) {
      this.isallowUpload = false;
    } else {
      this.isallowUpload = true;
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.isLoadDone = true;
    }, 100);
  }

  clickDownLoadFile(file: any) {
    file.isDownload = true;
    this.downloadFile({ id: file.id ?? file.uid }).subscribe((data: any) => {
      let blob = new Blob([data], { type: 'application/octet-stream' });
      const downloadURL = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = file.name;
      link.click();
      file.isDownload = false;
    });
  }

  removeFile = (file: any): boolean => {
    if (file.data.thaoTac !== 1) {
      file.data.thaoTac = 3;
      this.listFileDelete.push(file);
    }
    return true;
  };

  async removeFileOnClick(file: any) {
    const confirm = await this.messageService.confirm(
      'Bạn có chắc chắn muốn xóa file này không?'
    );
    if (!confirm) return;
    if (file.data.thaoTac !== 1) {
      file.data.thaoTac = 3;
      this.listFileDelete.push(file);
    }
    this.controlValue = this.controlValue.filter((x) => x.uid !== file.uid);
    this.eventBaseChange(this.getControlValue());
    this.eventOnChange.emit(this.getControlValue());
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.uploading = true;
    this.progress = 0;
    if (file.size && file.size > this.limitSizeFileUpload) {
      this.messageService.notiMessageError('Kích thước file vượt quá 50Mb');
      this.addRemoveClassError(
        this.elementRef.nativeElement,
        'nz-upload',
        'error-img',
        true
      );
      this.uploading = false;
      return false;
    }
    // validate định dạng file
    if (this.fileType) {
      let fileName: string = file.name;
      let listType = this.fileType.split(',');
      let valid = false;
      for (const t of listType) {
        if (fileName.toLowerCase().endsWith(t.toLowerCase())) valid = true;
      }
      if (!valid) {
        this.messageService.notiMessageError(
          'Tệp dữ liệu tải lên không đúng định dạng!'
        );
        this.addRemoveClassError(
          this.elementRef.nativeElement,
          'nz-upload',
          'error-img',
          true
        );
        this.uploading = false;
        return false;
      } else {
        this.addRemoveClassError(
          this.elementRef.nativeElement,
          'nz-upload',
          'error-img',
          false
        );
      }
    }

    // validate filesize
    if (this.fileSize) {
      // bytes to MB: 1048576
      // bytes to KB: 1024
      let size = file.size ? +(file.size / 1048576).toFixed(2) : 0;
      if (size > this.fileSize) {
        this.messageService.notiMessageError(
          'Kích thước file vượt quá ' + this.fileSize + ' Mb'
        );
        this.addRemoveClassError(
          this.elementRef.nativeElement,
          'nz-upload',
          'error-img',
          true
        );
        this.uploading = false;
        return false;
      } else {
        this.addRemoveClassError(
          this.elementRef.nativeElement,
          'nz-upload',
          'error-img',
          false
        );
      }
    }

    this.uploadFile({ file: file }).subscribe(
      async (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round((100 * event.loaded) / event.total);
        } else if (event instanceof HttpResponse) {
          try {
            const item: any = event.body.data;

            this.controlValue = this.controlValue.concat({
              uid: item.id,
              name: item.name,
              status: 'done',
              size: item.size,
              url: this.getPathUrl(item.id, item.name),
              data: { ...item, thaoTac: 1 },
            });

            this.eventBaseChange(this.getControlValue());
            this.eventOnChange.emit(this.getControlValue());

            this.uploading = false;
          } catch (error) {
            this.messageService.error(
              '',
              'Upload file bị lỗi. Vui lòng kiểm tra mạng và thử lại'
            );
            this.uploading = false;
          }
        }
      },
      () => {
        this.progress = 0;
        this.messageService.error(
          '',
          'Hệ thống xảy ra lỗi. Không thể tải file lên.'
        );
        this.uploading = false;
      }
    );
    return false;
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

  private getBase64(imgFile: NzUploadFile): Promise<string> {
    const img: File = imgFile as any;
    return new Promise(async (resove) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => resove(reader.result!.toString()));
      reader.readAsDataURL(img);
    });
  }

  changeFile() {
    this.eventBaseChange(this.getControlValue());
    this.eventOnChange.emit(this.getControlValue());
  }

  async writeValue(obj: any[]): Promise<void> {
    if (obj) {
      this.controlValue = obj
        .filter((x) => x.thaoTac !== 3)
        .map((item) => {
          return {
            uid: item.id,
            name: item.name,
            status: 'done',
            size: item.size,
            url: this.getPathUrl(item.id, item.name),
            data: item,
          };
        });
      this.listFileDelete = obj
        .filter((x) => x.thaoTac === 3)
        .map((item) => {
          return {
            uid: item.id,
            name: item.name,
            status: 'done',
            size: item.size,
            url: this.getPathUrl(item.id, item.name),
            data: item,
          };
        });
    } else {
      this.controlValue = [];
    }
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return null;
  }

  registerOnValidatorChange?(fn: () => void): void {}

  registerOnChange(fn: any) {
    this.eventBaseChange = fn;
  }

  registerOnTouched(fn: any) {
    this.eventBaseTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.showUploadList = {
      ...this.showUploadList,
      showRemoveIcon: !isDisabled,
    };
  }

  getControlValue() {
    const result = [
      ...this.controlValue
        .filter((x) => x.status === 'done')
        .map((x: any) => x.data),
      // ,...this.listFileDelete.map((x: any) => x.data),
    ];
    return result;
  }

  getPathUrl(id: string, name: string) {
    return `${this.fileBaseUrl}?id=${id}&fileName=${name}&isView=false`;
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
          url: file.url + '&isView=true',
        };
      },
      (eventName, eventValue) => {
        if (eventName === 'onClose') {
          this.dialogService.closeDialogById(dialog.id);
        }
      }
    );
  };
}
