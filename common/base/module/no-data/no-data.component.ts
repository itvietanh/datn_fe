import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-no-data',
  templateUrl: './no-data.component.html',
  styleUrls: ['./no-data.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NoDataComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
