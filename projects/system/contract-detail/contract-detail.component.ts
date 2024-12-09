import { Component, Input, OnInit, inject } from '@angular/core';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-contract-detail',
  templateUrl: './contract-detail.component.html',
  styleUrls: ['./contract-detail.component.scss'],
})
export class ContractDetailComponent implements OnInit {
  @Input() id: any;
  tab: any = { info: 0, tab1: 1, tab2: 2 };

  ngOnInit(): void {
    
  }
}
