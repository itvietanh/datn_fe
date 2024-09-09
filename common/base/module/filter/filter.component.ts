import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FilterConfig } from 'common/base/models';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
})
export class FilterComponent implements OnInit {
  @Output() search = new EventEmitter<any>();
  @Input() filters!: FilterConfig[];
  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    const controls: any = {};
    this.filters.forEach((filter) => {
      controls[filter.key] = [filter.default];
    });
    this.form = this.fb.group(controls);
    this.form.valueChanges
      .pipe(debounceTime(300))
      .subscribe((params) => this.search.emit(params));
  }
}
