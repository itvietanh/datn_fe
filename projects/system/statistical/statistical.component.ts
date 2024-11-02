import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ColumnConfig } from 'common/base/models';
import { MessageService } from 'common/base/service/message.service';
import { HotelService } from 'common/share/src/service/application/hotel/hotel.service';
import { ValidatorExtension } from 'common/validator-extension';
import { DialogService, PagingModel, DialogMode, DialogSize } from 'share';
import { FacilityDetailsComponent } from '../facility/facility-detail/facility-details.component';
import { FloorService } from 'common/share/src/service/application/hotel/floor.service';
import { StatisticalDetailComponent } from './statistical-detail/statistical-detail.component';
import { Service } from 'common/share/src/service/application/hotel/service.service';
import { StatisticalService } from 'common/share/src/service/application/hotel/statistical.service';

interface DataPoint {
  label: string; // Type for the label
  y: number;     // Type for the y value
}

@Component({
  selector: 'app-statistical',
  templateUrl: './statistical.component.html',
  styleUrls: ['./statistical.component.scss']
})
export class StatisticalComponent implements OnInit {
  public formSearch: FormGroup;
  public listOfData: any[] = [];
  public isLoading?: boolean;
  public paging: any;
  items: any[] = [];
  loading = false;
 

  // Update the chartOptions type
  chartOptions = {
    animationEnabled: true,
    title: {
      text: "Thống Kê Dịch Vụ Khách Sạn"
    },
    axisX: {
      title: "Tên Dịch Vụ",
      labelAngle: -45
    },
    axisY: {
      title: "Số Lượng",
      includeZero: true
    },
    axisY2: {
      title: "Doanh Thu (VNĐ)",
      includeZero: true
    },
    toolTip: {
      shared: true
    },
    legend: {
      cursor: "pointer",
      itemclick: function (e: any) {
        e.dataSeries.visible = typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible ? false : true;
        e.chart.render();
      }
    },
    data: [
      {
        type: "column",
        name: "Số Lượng",
        legendText: "Số Lượng",
        showInLegend: true,
        dataPoints: [] as DataPoint[] // Specify the type here
      },
      {
        type: "column",
        name: "Doanh Thu",
        axisYType: "secondary",
        legendText: "Doanh Thu (VNĐ)",
        showInLegend: true,
        dataPoints: [] as DataPoint[] // Specify the type here
      }
    ]
  };

  constructor(
    private fb: FormBuilder,
    private dialogService: DialogService,
    private messageService: MessageService,
    public hotelService: HotelService,
    private datePipe: DatePipe,
    public floorService: FloorService,
    public service: Service,
    private statisticalService: StatisticalService
  ) {
    this.formSearch = this.fb.group({
      service_name: [null],
      service_price: [null]
    });
    this.formSearch.get('outEndDate')?.addValidators(
      ValidatorExtension.gteDateValidator(
        this.formSearch,
        'signEndDate',
        'Ngày hết hạn hợp đồng không được nhỏ hơn ngày ký hợp đồng'
      )
    );
    this.formSearch.get('outEndDate')?.addValidators(
      ValidatorExtension.gteDateValidator(
        this.formSearch,
        'outStartDate',
        'Ngày hết hạn hợp đồng không được nhỏ hơn ngày ký hợp đồng'
      )
    );
  }

  ngOnInit() {
    this.isLoading = true;
    this.getData();
    this.isLoading = false;
  }

  async getData(paging: PagingModel = { page: 1, size: 20 }) {
    const params = {
      ...paging,
      ...this.formSearch.value
    }
    this.dialogService.openLoading();
    const rs = await this.service.getPaging(params).firstValueFrom();
    const dataRaw = rs.data!.items;
    console.log("dataRaw:", dataRaw);
  
    // Map data into dataPoints for chart
    this.chartOptions.data[0].dataPoints = dataRaw.map(item => ({
      label: item.service_name, // Tên dịch vụ
      y: item.service_usage_count || 0     // Số lượng, sử dụng giá trị mặc định nếu không có
    }));
  
    this.chartOptions.data[1].dataPoints = dataRaw.map(item => ({
      label: item.service_name,  // Tên dịch vụ
      y: item.service_price || 0 // Giá dịch vụ, sử dụng giá trị mặc định nếu không có
    }));
  
    // Map additional data from StatisticalService
    this.chartOptions.data[2].dataPoints = dataRaw.map(item => ({
      label: item.service_name,  // Tên dịch vụ
      y: item.statistical_value || 0 // Giá trị thống kê từ StatisticalService, sử dụng giá trị mặc định nếu không có
    }));
  
    this.items = rs.data!.items;
    this.paging = rs.data?.meta;
    this.dialogService.closeLoading();
  }
  

  async handlerOpenDialog(mode: string = DialogMode.add, item: any = null) {
    const dialog = this.dialogService.openDialog(
      async (option) => {
        option.title = mode === 'view' ? 'Xem Chi Tiết Dịch Vụ' : 'Thêm Mới Dịch Vụ';
        if (mode === 'edit') option.title = 'Cập Nhật Dịch Vụ';
        option.size = DialogSize.xlarge;
        option.component = StatisticalDetailComponent; // open component
        option.inputs = {
          uuid: item?.uuid,
          mode: mode,
        };
      },
      (eventName, eventValue) => {
        if (eventName === 'onClose') {
          this.dialogService.closeDialogById(dialog.id);
          if (eventValue) {
            this.getData({ ...this.paging });
          }
        }
      }
    );
  }

  async handlerDelete(item: any) {
    const confirm = await this.messageService.confirm('Bạn có muốn xóa dữ liệu này không?');
    if (confirm) {
      const rs = await this.hotelService.delete(item?.uuid).firstValueFrom();
      if (rs.data) {
        this.messageService.notiMessageSuccess('Xóa dữ liệu thành công');
        return this.getData({ ...this.paging });
      }
    }
  }
}
