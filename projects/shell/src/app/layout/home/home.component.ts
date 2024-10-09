import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageUtil } from 'common/base/utils';
import {
  AccommodationFacilityService,
  DialogService,
} from 'share';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public listOfData: any[] = [];
  public paging: any;
  public init = false;
  public message = '';

  constructor(
    private rt: Router,
    private ar: ActivatedRoute,
    private dialogService: DialogService,
    private accommodationFacilityService: AccommodationFacilityService,
    private location: Location
  ) {}

  async ngOnInit() {
    this.init = true;
  }

  selectItem(item: any) {
    // LocalStorageUtil.setFacilityId(item.id);
    location.reload();
  }

  logout() {
    this.rt.navigate(['/auth', 'logout']);
  }

  gotoRegis() {
    location.href = this.location.prepareExternalUrl(
      '/he-thong/quan-ly-co-so-luu-tru'
    );
  }
}
