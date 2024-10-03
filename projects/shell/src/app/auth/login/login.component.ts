import { DatePipe} from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ColumnConfig } from 'common/base/models';
import { MessageService } from 'common/base/service/message.service';
import { HotelService } from 'common/share/src/service/application/hotel/hotel.service';
import { ValidatorExtension } from 'common/validator-extension';
import { FacilityDetailsComponent } from 'projects/system/facility/facility-detail/facility-details.component';
import { DialogMode, DialogService, DialogSize, PagingModel } from 'share';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit {
  public formSearch: FormGroup

  constructor(
    private fb: FormBuilder,
    private dialogService: DialogService,
    private messageService: MessageService,
  ) {
    this.formSearch = this.fb.group({
      name: [null],
      address: [null]
    })
  }

  ngOnInit() {
   
  }

  async getData(paging: PagingModel = { page: 1, size: 20 }) {
    this.dialogService.closeLoading();
  }

  
}
