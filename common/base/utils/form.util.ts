import { FormArray, FormGroup } from '@angular/forms';
import { debounceTime, filter } from 'rxjs';

export class InvalidFormError extends Error { }

export class FormUtil {
  static validate(form: FormGroup, recursive = false) {
    if (!recursive) {
      (form as any)['_validating'] = true;
    }
    for (const key in form.controls) {
      form.controls[key].markAsDirty();
      form.controls[key].updateValueAndValidity();
      if (form.controls[key] instanceof FormGroup) {
        FormUtil.validate(form.controls[key] as FormGroup, true);
      } else if (form.controls[key] instanceof FormArray) {
        const formArray = (form.controls[key] as FormArray).controls;
        for (const iterator of formArray) {
          FormUtil.validate(iterator as FormGroup, true);
        }
      }
    }
    if (!recursive) {
      (form as any)['_validating'] = false;
    }
    if (form.invalid && !recursive) {
      throw new InvalidFormError();
    }
  }

  static valueChanges(form: FormGroup, path: string, dueTime = 300) {
    return form.get(path)!.valueChanges.pipe(
      filter(() => !(form as any)['_validating']),
      debounceTime(dueTime)
    );
  }
}
