import { Directive, ElementRef, EventEmitter, Input, Output, Renderer2 } from '@angular/core';
import { ExtentionService } from '../service/extention.service';

declare let $: any;
@Directive({
  selector: '[tableHistory]'
})
export class TableHistoryDirective {

  @Input() dataNew: any | undefined | null;
  @Input() dataOld: any | undefined | null;
  @Input() offHistory: boolean | undefined;
  @Output() onData = new EventEmitter<any[]>();

  private title: string = '';
  private listenClick: any;
  private dataChange: any[] = [];

  constructor(private renderer: Renderer2,
    private hostElement: ElementRef,
    private ex: ExtentionService
  ) { }

  ngOnChanges() {
    setTimeout(() => {
      this.initData();
    }, 300);
  }

  async initData() {
    if (!this.hostElement?.nativeElement) return;
    if (this.offHistory) {
      this.renderer.removeClass(this.hostElement.nativeElement, 'table-edit');
      $(this.hostElement.nativeElement).find('.i-his').remove();
      this.listenClick;//remove listen
      return;
    }
    if(!this.dataNew) this.dataNew = [];
    if(!this.dataOld) this.dataOld = [];

    this.getValueChange();
  }

  getValueChange() {
    this.dataChange = JSON.parse(JSON.stringify(this.dataNew));

    for (const item of this.dataChange) {
      item.thaoTac = 0; // không thay đổi
      const duLieuCu = this.dataOld.find((x: any) => x.id === item.id);
      if (!duLieuCu) {
        item.thaoTac = 1; // thêm
        continue;
      } else {
        // check thay đổi
        const changeValue = !this.ex.deepCompare(item, duLieuCu, ['dinhKem','thaoTac']);
        if (changeValue) {
          item.thaoTac = 2; // Sửa
          item.dataOld = duLieuCu;
        }
      }
    }

    // tim cac item xóa
    for (const item of this.dataOld) {
      let itemJson = JSON.parse(JSON.stringify(item));
      const duLieuMoi = this.dataChange.find((x: any) => x.id === itemJson.id);
      if (!duLieuMoi) {
        itemJson.thaoTac = 3; // xóa
        this.dataChange.push(itemJson);
      }
    }

    this.onData.emit(this.dataChange);
  }
}
