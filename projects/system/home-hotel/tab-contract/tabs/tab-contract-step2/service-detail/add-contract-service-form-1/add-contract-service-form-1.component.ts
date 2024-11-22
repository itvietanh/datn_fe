import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormUtil } from 'common/base/utils';
import { ValidatorExtension } from 'common/validator-extension';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { finalize } from 'rxjs';
import { ContractServiceService } from 'share';

@Component({
  selector: 'app-add-contract-service-form-1',
  templateUrl: './add-contract-service-form-1.component.html',
  styleUrls: ['./add-contract-service-form-1.component.scss'],
})
export class AddContractServiceForm1Component implements OnInit {
  @Output() selectedServiceChange = new EventEmitter<any>();
  @Input() code!: string;
  myForm!: FormGroup;

  readonly #modal = inject(NzModalRef);
  readonly nzModalData: any = inject(NZ_MODAL_DATA);
  objectEdit: any = {};
  price = 0;

  constructor(
    private fb: FormBuilder,
    private contractServiceService: ContractServiceService
  ) { }

  ngOnInit() {
    if (this.nzModalData?.active === 'EDIT') {
      this.objectEdit = {
        ...this.nzModalData?.objectEdit,
        active: this.nzModalData?.active,
      };
      this.price = this.objectEdit?.price / this.objectEdit?.quantity;

      this.myForm = this.fb.group({
        quantity: [this.objectEdit?.quantity, ValidatorExtension.required()],
      });
    }
  }

  changeQuantity(event: any) {
    if (event <= 0) {
      this.objectEdit.price = 0;
      this.objectEdit.totalAmountAfterVat = 0;
    } else {
      this.objectEdit.price = this.price * event;

      this.objectEdit.totalAmountAfterVat =
        this.objectEdit.price +
        (this.objectEdit.price * this.objectEdit.vat) / 100;
    }
  }

  submit() {
    // this.loading = true;
    FormUtil.validate(this.myForm);
    const data = this.myForm.value;
    if (!this.objectEdit?.id) {
      data.id = Date.now();
      this.selectedServiceChange.emit(data);
      this.myForm.reset();
    } else {
      data.id = this.objectEdit.id;
      this.contractServiceService
        .edit(this.objectEdit.id, {
          ...this.objectEdit,
          quantity: data.quantity,
        })
        .pipe(
          finalize(() => {
            this.#modal.destroy(true);
          })
        )
        .subscribe(() => { });
    }
  }
}
