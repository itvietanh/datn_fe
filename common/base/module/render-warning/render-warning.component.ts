import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-render-warning',
  templateUrl: './render-warning.component.html',
  styleUrls: ['./render-warning.component.scss']
})
export class RenderWarningComponent implements OnInit {

  @Input() control: FormControl | any;

  constructor() { }

  ngOnInit() {
  }

}
