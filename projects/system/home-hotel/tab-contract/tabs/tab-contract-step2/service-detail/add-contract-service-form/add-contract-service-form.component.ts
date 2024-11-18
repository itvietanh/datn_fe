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
  selector: 'app-add-contract-service-form',
  templateUrl: './add-contract-service-form.component.html',
  styleUrls: ['./add-contract-service-form.component.scss'],
})
export class AddContractServiceFormComponent implements OnInit {
  @Output() selectedServiceChange = new EventEmitter<any>();
  @Input() code!: string;
  myForm!: FormGroup;

  readonly #modal = inject(NzModalRef);
  readonly nzModalData: any = inject(NZ_MODAL_DATA);
  objectEdit: any = null;

  constructor(
    private fb: FormBuilder,
    private contractServiceService: ContractServiceService
  ) {}

  ngOnInit() {
    if (this.nzModalData?.active === 'EDIT') {
      this.objectEdit = {
        ...this.nzModalData.objectEdit,
        active: this.nzModalData?.active,
      };
      this.myForm = this.fb.group({
        note: [this.objectEdit?.note, ValidatorExtension.required()],
        totalAmount: [
          this.objectEdit?.totalAmount,
          ValidatorExtension.required(),
        ],
      });
    } else {
      this.myForm = this.fb.group({
        note: [null, ValidatorExtension.required()],
        totalAmount: [null, ValidatorExtension.required()],
      });
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
          note: data.note,
          totalAmount: data.totalAmount,
        })
        .pipe(
          finalize(() => {
            this.#modal.destroy(true);
          })
        )
        .subscribe(() => {});
    }
  }
}
