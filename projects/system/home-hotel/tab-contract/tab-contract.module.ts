import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NzTabsModule } from "ng-zorro-antd/tabs";
import { NzToolTipModule } from "ng-zorro-antd/tooltip";

import { NzUploadModule } from "ng-zorro-antd/upload";
import { FormModule } from "common/base/module/form.module";
import { TabContractComponent } from "./tab-contract.component";
import { TabContactStep1Component } from "./tabs/tab-contact-step1/tab-contact-step1.component";
import { TabContactStep2Component } from "./tabs/tab-contract-step2/tab-contract-step2.component";

@NgModule({
  imports: [
    CommonModule,
    FormModule,
    NzTabsModule,
    NzUploadModule,
    NzToolTipModule
  ],
  exports: [TabContractComponent],
  declarations: [
    TabContractComponent,
    //Sign
    TabContactStep1Component,
    TabContactStep2Component,
  ],
})
export class TabContractModule {}
