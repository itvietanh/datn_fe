import { DatePipe } from '@angular/common';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ColumnConfig } from 'common/base/models';
import { MessageService } from 'common/base/service/message.service';
import { HotelService } from 'common/share/src/service/application/hotel/hotel.service';
import { ValidatorExtension } from 'common/validator-extension';
import { DialogService, PagingModel, DialogMode, DialogSize } from 'share';
import { TransactionService } from 'common/share/src/service/application/hotel/transaction.service';
import { FacilityDetailsComponent } from 'projects/system/facility/facility-detail/facility-details.component';
import { ChartConfiguration } from 'chart.js';
import { ServiceDetailComponent } from './service-detail/service-detail.component';
import { Service } from 'common/share/src/service/application/hotel/service.service';
import { StatisticalService } from 'common/share/src/service/application/hotel/statistical.service';
import { FloorService } from 'common/share/src/service/application/hotel/floor.service';



@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent implements OnInit, OnChanges {

  timeFilter: string = 'daily';
  chartType: string = 'line';
  loading: boolean = false;
  error: string | null = null;

  // Data for the charts
  dummyData: any = {
    daily: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Bookings",
          data: [65, 59, 80, 81, 56, 55, 40],
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.2)"
        },
        {
          label: "Revenue",
          data: [28, 48, 40, 19, 86, 27, 90],
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.2)"
        }
      ]
    },
    weekly: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      datasets: [
        {
          label: "Bookings",
          data: [300, 450, 320, 280],
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.2)"
        },
        {
          label: "Revenue",
          data: [500, 650, 400, 580],
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.2)"
        }
      ]
    },
    monthly: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Bookings",
          data: [1200, 1900, 1500, 1700, 2000, 1800],
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.2)"
        },
        {
          label: "Revenue",
          data: [3000, 3500, 2800, 3200, 3800, 3400],
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.2)"
        }
      ]
    }
  };

  options: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Thống kê dịch  vụ'
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };


  ngOnInit(): void {
    this.getData();
    this.refreshData();
  } 

  async refreshData(): Promise<void> {
    try {
      this.loading = true;
      this.error = null;
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      this.error = 'Failed to fetch data. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartType']) {
      this.renderChart(this.chartType);
    }
  }

  getChartData() {
    return this.dummyData[this.timeFilter];
  }

  renderChart(chartType: string) {
    this.chartType = chartType;
  }

  ////////////////////////////////////////////////////////////////
  public formSearch: FormGroup;
  public listOfData: any[] = [];
  public isLoading?: boolean;
  public paging: any;
  items: any[] = [];

  columns: ColumnConfig[] = [
    {
      key: 'hotel_name',
      header: 'Tên khách sạn',
    },
    {
      key: 'service_name',
      header: 'Tên dịch vụ',
    },
    {
      key: 'service_price',
      header: 'Giá dịch vụ',
    },
    {
      key: 'created_at',
      header: 'Ngày tạo',
    },
    {
      key: 'action',
      header: 'Thao tác',
      tdClass: 'text-center',
      pipe: 'template',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private dialogService: DialogService,
    private messageService: MessageService,
    public hotelService: HotelService,
    private datePipe: DatePipe,
    public floorService: FloorService,
    public service: Service,
    public statistical: StatisticalService,
  ) {
    this.formSearch = this.fb.group({
      hotel_id: [null],
      service_name: [null],
      service_price: [null]
    });
    this.formSearch
      .get('outEndDate')
      ?.addValidators(
        ValidatorExtension.gteDateValidator(
          this.formSearch,
          'signEndDate',
          'Ngày hết hạn hợp đồng không được nhỏ hơn ngày ký hợp đồng'
        )
      );
    this.formSearch
      .get('outEndDate')
      ?.addValidators(
        ValidatorExtension.gteDateValidator(
          this.formSearch,
          'outStartDate',
          'Ngày hết hạn hợp đồng không được nhỏ hơn ngày ký hợp đồng'
        )
      );
  }


  async getData(paging: PagingModel = { page: 1, size: 20 }) {
    const params = {
      ...paging,
      ...this.formSearch.value 
    };
    this.isLoading = true; 
    this.dialogService.openLoading();
  
    try {
      const rs = await this.service.getPaging(params).firstValueFrom();
      const dataRaw = rs.data!.items;
  
      // Tạo các mảng lưu dữ liệu cho biểu đồ
      const bookingData: number[] = [];
      const revenueData: number[] = [];
      const labels: string[] = [];
  
      // Duyệt qua dữ liệu để trích xuất thông tin cần thiết
      for (const item of dataRaw) {
        if (item.created_at) {
          const date = this.datePipe.transform(item.created_at, 'dd-MM-yyyy');
          labels.push(date || '');
  
          // Giả sử `service_price` đại diện cho doanh thu của dịch vụ
          bookingData.push(item.bookingCount || 0); // số lượt đặt (giả định)
          revenueData.push(item.service_price || 0); // doanh thu (giả định)
        }
      }
  
      // Chèn dữ liệu vào cấu trúc biểu đồ
      this.dummyData.daily = {
        labels: labels,
        datasets: [
          {
            label: "Bookings",
            data: bookingData,
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.2)"
          },
          {
            label: "Revenue",
            data: revenueData,
            borderColor: "rgb(53, 162, 235)",
            backgroundColor: "rgba(53, 162, 235, 0.2)"
          }
        ]
      };
  
      // Cập nhật `items` và `paging`
      this.items = dataRaw;
      this.paging = rs.data?.meta;
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      this.dialogService.closeLoading();
      this.isLoading = false; 
    }
  }
  
  
  
  

  async handlerOpenDialog(mode: string = DialogMode.add, item: any = null) {
    const dialog = this.dialogService.openDialog(
      async (option) => {
        option.title = mode === 'view' ? 'Xem Chi Tiết Dịch Vụ' : 'Thêm Mới Dịch Vụ';
        if (mode === 'edit') option.title = 'Cập Nhật Dịch Vụ';
        option.size = DialogSize.xlarge;
        option.component = ServiceDetailComponent;// open component; (mở component)
        option.inputs = {
          uuid: item?.uuid,
          item: item,
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
      const rs = await this.service.delete(item?.uuid).firstValueFrom();
      if (rs.data) {
        this.messageService.notiMessageSuccess('Xóa dữ liệu thành công');
        return this.getData({ ...this.paging });
      }
    }
  }
}
