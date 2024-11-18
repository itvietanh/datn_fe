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
      const rss = await this.statistical.getAll(params).firstValueFrom();
  
      const dataRawMonth = rss.data!.monthly_revenue;
      const dataRawWeek = rss.data!.weekly_revenue;
      const dataRawDay = rs.data!.items;
  
      // Mảng lưu dữ liệu cho biểu đồ
      const bookingDataDay: number[] = [];
      const revenueDataDay: number[] = [];
      const labelsDay: string[] = [];
  
      const bookingDataWeek: number[] = [];
      const revenueDataWeek: number[] = [];
      const labelsWeek: string[] = [];
  
      const bookingDataMonth: number[] = [];
      const revenueDataMonth: number[] = [];
      const labelsMonth: string[] = [];
  
      // Xử lý dữ liệu theo Ngày
      for (const item of dataRawDay) {
        if (item.created_at) {
          const date = this.datePipe.transform(item.created_at, 'dd-MM-yyyy');
          if (date) {
            labelsDay.push(date);  // Thêm ngày vào mảng labelsDay
            bookingDataDay.push(item.service_usage_count || 0);
            revenueDataDay.push(item.total_revenue || 0);
          }
        }
      }
  
      // Xử lý dữ liệu theo Tuần
      for (const item of dataRawWeek || []) {
        if (item && item.total_revenue !== undefined) {
          labelsWeek.push(`Week ${item.week_number}`);
          bookingDataWeek.push(item.service_usage_count || 0);
          revenueDataWeek.push(item.total_revenue);
        }
      }
  
      // Xử lý dữ liệu theo Tháng
      for (const item of dataRawMonth || []) {
        if (item && item.total_revenue !== undefined) {
          const month = this.datePipe.transform(item.month, 'MM-yyyy');
          labelsMonth.push(month || '');
          bookingDataMonth.push(item.service_usage_count || 0);
          revenueDataMonth.push(item.total_revenue);
        }
      }
  
   
  
      // Cập nhật dữ liệu cho biểu đồ Ngày
     // Cập nhật dữ liệu cho biểu đồ Ngày
this.dummyData.daily = {
  labels: labelsDay,  // Mảng nhãn (Ngày)
  datasets: [
    {
      label: 'Bookings (Daily)',
      data: bookingDataDay,  // Dữ liệu đặt chỗ theo ngày
      borderColor: 'rgb(75, 192, 192)',  // Màu sắc đường viền
      backgroundColor: 'rgba(75, 192, 192, 0.2)'  // Màu nền
    },
    {
      label: 'Revenue (Daily)',
      data: revenueDataDay,  // Dữ liệu doanh thu theo ngày
      borderColor: 'rgb(53, 162, 235)',  // Màu sắc đường viền
      backgroundColor: 'rgba(53, 162, 235, 0.2)'  // Màu nền
    }
  ]
};

  
      // Cập nhật dữ liệu cho biểu đồ Tuần
      this.dummyData.weekly = {
        labels: labelsWeek,
        datasets: [
          {
            label: 'Bookings (Weekly)',
            data: bookingDataWeek,
            borderColor: 'rgb(255, 159, 64)',
            backgroundColor: 'rgba(255, 159, 64, 0.2)'
          },
          {
            label: 'Revenue (Weekly)',
            data: revenueDataWeek,
            borderColor: 'rgb(153, 102, 255)',
            backgroundColor: 'rgba(153, 102, 255, 0.2)'
          }
        ]
      };
  
      // Cập nhật dữ liệu cho biểu đồ Tháng
      this.dummyData.monthly = {
        labels: labelsMonth,
        datasets: [
          {
            label: 'Bookings (Monthly)',
            data: bookingDataMonth,
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)'
          },
          {
            label: 'Revenue (Monthly)',
            data: revenueDataMonth,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)'
          }
        ]
      };
  
      // Gọi renderChart() để cập nhật biểu đồ
      this.renderChart(this.chartType);
  
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
