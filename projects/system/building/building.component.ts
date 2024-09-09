import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ValidatorExtension } from 'common/validator-extension';

@Component({
  selector: 'app-building',
  templateUrl: './building.component.html',
  styleUrls: ['./building.component.scss']
})
export class BuildingComponent implements OnInit {
  public myForm: FormGroup;
  
  constructor(
    private fb: FormBuilder,
  ) {
    this.myForm = this.fb.group({
      
    });
  }

  ngOnInit() {
  }

}
