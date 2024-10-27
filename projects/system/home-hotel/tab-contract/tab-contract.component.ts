import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TabContractService } from './tab-contract.service';
import { MessageService } from 'common/base/service/message.service';
import { DialogMode, AccommodationFacilityService, DialogService } from 'share';

@Component({
  selector: 'app-tab-contract',
  templateUrl: 'tab-contract.component.html',
  styleUrls: ['tab-contract.component.scss'],
  providers: [TabContractService],
})
export class TabContractComponent implements OnInit {
  @Input() uuid: any;
  @Input() mode: string = DialogMode.add;
  @Input() item:any;
  @Output() onClose = new EventEmitter<any | null>();

  public initForm = false;
  constructor(
    public accommodationFacilityService: AccommodationFacilityService,
    public shareData: TabContractService,
    private dialogService: DialogService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.shareData.uuid = this.uuid;
    this.shareData.mode = this.mode;
    this.shareData.item = this.item;
    this.shareData.onClose = this.onClose;
    this.intData();
  }

  async intData(){
    await this.shareData.getDataTab1(this.mode);
    this.initForm = true;
  }

  changeFacility(event: any) {
    this.uuid =  event.uuid;
  }
}
