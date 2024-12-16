import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NzTabsModule } from "ng-zorro-antd/tabs";
import { NzToolTipModule } from "ng-zorro-antd/tooltip";

import { NzUploadModule } from "ng-zorro-antd/upload";
import { FormModule } from "common/base/module/form.module";
import { TabContractComponent } from "./tab-contract.component";
import { TabContactStep1Component } from "./tabs/tab-contact-step1/tab-contact-step1.component";
import { TabContactStep2Component } from "./tabs/tab-contract-step2/tab-contract-step2.component";
import { TabContactStep3Component } from "./tabs/tab-contract-step3/tab-contract-step3.component";
import { GuestDetailComponent } from "./tabs/tab-contract-step2/guest-detail/guest-detail.component";
import { GuestEditComponent } from "./tabs/tab-contract-step2/guest-edit/guest-edit.component";
import { CustomerScannerModule } from "projects/system/customer-scanner/customer-scanner.module";

@NgModule({
  imports: [
    CommonModule,
    FormModule,
    NzTabsModule,
    NzUploadModule,
    NzToolTipModule,
    CustomerScannerModule,

    // ReactiveFormsModule
  ],
  exports: [TabContractComponent],
  declarations: [
    TabContractComponent,
    //Sign
    TabContactStep1Component,
    TabContactStep2Component,
    TabContactStep3Component,
    GuestDetailComponent,
    GuestEditComponent
  ],
})
export class TabContractModule { }
