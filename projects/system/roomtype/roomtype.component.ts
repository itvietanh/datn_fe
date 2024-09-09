import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ValidatorExtension } from 'common/validator-extension';

@Component({
  selector: 'app-room-type',
  templateUrl: './roomtype.component.html',
  styleUrls: ['./roomtype.component.scss']
})
export class RoomTypeComponent implements OnInit {
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
