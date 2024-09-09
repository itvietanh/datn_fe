import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import Mustache from 'mustache';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { TemplateService } from 'share';

@Component({
  selector: 'app-printer',
  templateUrl: './printer.component.html',
  styleUrls: ['./printer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrinterComponent implements OnInit {
  @ViewChild('iframe') iframe!: ElementRef<HTMLIFrameElement>;
  readonly #modal = inject(NzModalRef);
  readonly nzModalData: any = inject(NZ_MODAL_DATA);

  constructor(private templateService: TemplateService) {}

  ngOnInit(): void {
    this.render();
  }

  render() {
    this.templateService
      .get(this.nzModalData.template)
      .subscribe((template) => {
        const temp = Mustache.render(template, this.nzModalData.view);
        const doc =
          this.iframe.nativeElement.contentDocument ||
          this.iframe.nativeElement.contentWindow;
        doc?.open();
        (doc as Document).write(temp);
        doc?.close();
      });
  }

  print() {
    this.iframe.nativeElement.contentWindow?.print();
  }

  close() {
    this.#modal.destroy();
  }
}
