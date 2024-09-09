import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
@Component({
  selector: 'app-dialog-loading',
  templateUrl: './dialog-loading.component.html',
  styleUrls: ['./dialog-loading.component.scss']
})
export class DialogLoadingComponent implements OnInit, OnDestroy {

  @Input() timeDisable: number | null = 5;
  @Input() title: string = '' ;
  @Output() onClose = new EventEmitter<any>();

  public t: any;
  constructor() { }

  ngOnInit() {
    this.t = setInterval(() => {
      if (this.timeDisable && this.timeDisable > 0) {
        this.timeDisable!--;
        if (this.timeDisable === 0) {
          this.timeDisable = null;
        }

      } else {
        clearInterval(this.t);
      }
    }, 1000);
  }

  ngOnDestroy() {
    if(this.t){
      clearInterval(this.t);
    }
  }

  cancelLoading(){
    this.onClose.emit(null);
  }


}
