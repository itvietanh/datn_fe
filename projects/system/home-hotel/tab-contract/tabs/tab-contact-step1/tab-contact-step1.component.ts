import { Component, OnInit, inject } from "@angular/core";
import { FormGroup } from "@angular/forms";
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

  constructor(
    public shareData: TabContractService,
  ) {
    this.myForm = shareData.myForm;
  }

  ngOnInit() {

  }

}
