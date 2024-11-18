import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Service } from 'common/share/src/service/application/hotel/service.service';
import { finalize } from 'rxjs';
import { DialogService, ServiceCategoryService, ServiceService } from 'share';

@Component({
  selector: 'app-add-contract-service-list',
  templateUrl: './add-contract-service-list.component.html',
  styleUrls: ['./add-contract-service-list.component.scss'],
})
export class AddContractServiceListComponent implements OnInit {
  @Output() selectedServiceChange = new EventEmitter<any>();
  categories: any[] = [];
  items: any[] = [];
  loading = false;
  loadingService = false;

  constructor(
    private serviceCategoryService: ServiceCategoryService,
    private service: Service,
    private dialogService: DialogService
  ) { }

  ngOnInit() {
    this.getCategories();
  }

  async getCategories() {
    this.dialogService.openLoading();
    const res = await this.service.getPaging().firstValueFrom();
    this.categories = res.data!.items;
    if (this.categories) {
      this.getServices(this.categories[0].id);
    }
    this.dialogService.closeLoading();
  }

  async getServices(id: any) {
    this.dialogService.openLoading();
    const res = await this.service.getListService({ id }).firstValueFrom();
    this.items = res.data!.items;
    this.dialogService.closeLoading();
  }
}
