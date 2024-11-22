import { Component, OnInit, inject } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { NZ_MODAL_DATA } from "ng-zorro-antd/modal";
import { TabContractService } from "../../tab-contract.service";
import { MessageService } from "common/base/service/message.service";
import { EContractService } from "common/share/src/service/application/accom/e-contrcact.service";
import { ValidatorExtension } from "common/validator-extension";
import { GENDERS, GenderService, DiaBanService, BusinessTypeService, AccommodationUserService, AccomTypesService, ScaleTypeService, ShrContractService, DialogService, PagingModel, DialogSize, DialogMode } from "share";


@Component({
  selector: 'app-tab-contact-step1',
  templateUrl: './tab-contact-step1.component.html',
  styleUrls: ['./tab-contact-step1.component.scss'],
})
export class TabContactStep1Component implements OnInit {
  public myForm: FormGroup;
  readonly nzModalData: any = inject(NZ_MODAL_DATA);

  listGuest: any[] = [];
  totalAmountSum = 0;
  totalAmount = 0;
  taxAmount = 0;
  remainingAmount = 0
  qrCode: any;

  constructor(
    public shareData: TabContractService,
    private fb: FormBuilder,

  ) {
    this.myForm = shareData.myForm;
  }

  ngOnInit() {
    this.myForm.get('paymentMethod')?.enable();
    
  }

  hanldeChangeMethod() {
    const method = this.myForm.get('paymentMethod')?.value;
    if (method === 2) {
      this.qrCode = this.shareData.paymentMethod[1].qrCode;
    } else if (method === 1) {
      this.qrCode = null;
    }
  }

}
