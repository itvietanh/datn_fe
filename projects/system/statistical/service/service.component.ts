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

  public formSearch!: FormGroup;
  timeFilter: string = 'daily';
  chartType: string = 'bar';
  loading: boolean = false;
  error: string | null = null;


  // Data for the charts
  listChartType: any[] = [
    {
      value: 'bar',
      label: 'Biều đồ cột'
    },
    {
      value: 'line',
      label: 'Biều đồ đường kẻ'
    }
  ];

  chartData: any = {
    labels: [],
    datasets: []
  };

  options: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Thống kê dich vụ',
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }); // Định dạng tiền tệ
          }
        }
      }
    }
  };

  constructor(
    private fb: FormBuilder,
    private dialogService: DialogService,
    private messageService: MessageService,
    public hotelService: HotelService,
    private datePipe: DatePipe,
    public StatisticalService: StatisticalService,
  ) {
    this.formSearch = this.fb.group({
      dateFrom: [null, ValidatorExtension.required()],
      dateTo: [null, ValidatorExtension.required()],
      chartType: [null]
    });
    this.formSearch
      .get('dateTo')
      ?.addValidators(
        ValidatorExtension.gteDateValidator(
          this.formSearch,
          'dateFrom',
          'Ngày kết thúc không được nhỏ hơn ngày bắt đầu'
        )
      );
    this.formSearch
      .get('dateTo')
      ?.addValidators(
        ValidatorExtension.gteDateValidator(
          this.formSearch,
          'dateTo',
          'Ngày kết thúc không được nhỏ hơn ngày bắt đầu'
        )
      );
  }

  ngOnInit(): void {
    this.refreshData();
  }

  async getData() {
    this.formSearch.markAllAsTouched();
    if (this.formSearch.invalid) return;
    this.dialogService.openLoading();
    const params = this.formSearch.getRawValue();
    const res = await this.StatisticalService.getAll(params).firstValueFrom();
    const dataStatistical = res.data?.statistical;

    this.chartData = {
      labels: dataStatistical.map((item: any) => item.total_revenue),
      datasets: [
        {
          label: "Doanh thu",
          data: dataStatistical.map((item: any) => item.total_revenue),
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          fill: true
        }
      ]
    };

    this.dialogService.closeLoading();
  }

  async refreshData(): Promise<void> {
    try {
      this.loading = true;
      this.dialogService.openLoading();
      this.error = null;
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      this.error = 'Failed to fetch data. Please try again.';
    } finally {
      this.loading = false;
      this.dialogService.closeLoading();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartType']) {
      this.renderChart(this.chartType);
    }
  }

  renderChart(chartType: string = "") {
    this.dialogService.openLoading();
    this.chartType = chartType;
    this.dialogService.closeLoading();
  }

  handlerSearchDate() {
    const dateFrom = this.formSearch.get('dateFrom')?.value;
    const dateTo = this.formSearch.get('dateTo')?.value;

    if (dateTo < dateFrom) {
      this.formSearch
        .get('dateTo')
        ?.setValidators(
          ValidatorExtension.gteDateValidator(
            this.formSearch,
            'dateFrom',
            'Ngày kết thúc không được nhỏ hơn ngày bắt đầu'
          )
        );
      this.formSearch
        .get('dateTo')?.updateValueAndValidity();
    } else {
      this.formSearch
        .get('dateTo')?.setErrors(null);
    }
  }

  async handleExportExcel() {
    this.getData();
    this.dialogService.openLoading();
    const params = this.formSearch.getRawValue();
  
    try {
      const res: any = await this.StatisticalService.getAll(params).firstValueFrom();
  
      if (res) {
        const blob = new Blob([res], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
  
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "thong-ke-dich-vu.xlsx";
        a.click();
  
        this.messageService.notiMessageSuccess("Kết xuất dữ liệu thành công");
      } else {
        throw new Error("Dữ liệu không hợp lệ để xuất Excel.");
      }
    } catch (error) {
      console.error(error);
      this.messageService.notiMessageError("Kết xuất dữ liệu thất bại");
    } finally {
      this.dialogService.closeLoading();
    }
  }
  
  public getTransactionStatisticsByDate() {
    this.dialogService.openLoading();
    const params = this.formSearch.getRawValue();
  
    this.StatisticalService.getAll(params).subscribe(
      (response) => {
        // Kiểm tra nếu response.data là một object
        if (response && response.data && typeof response.data === "object") {
          const data = response.data;
  
          // Trích xuất thông tin theo các thuộc tính từ API
          this.chartData = {
            labels: ["Tổng doanh thu", "Số lần sử dụng dịch vụ"], // Hoặc tùy chỉnh label khác
            datasets: [
              {
                label: "Thống kê dịch vụ",
                data: [
                  parseFloat(data.total_revenue) || 0,
                  parseInt(data.service_usage_count) || 0,
                ],
                borderColor: "rgb(75, 192, 192)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                fill: true,
              },
            ],
          };
        } else {
          this.chartData = {
            labels: [],
            datasets: [],
          };
          this.error = "Dữ liệu trả về không hợp lệ.";
          console.error("Invalid data format:", response.data);
        }
        this.dialogService.closeLoading();
      },
      (error) => {
        this.error = "Lỗi khi lấy dữ liệu thống kê giao dịch.";
        console.error(error);
        this.dialogService.closeLoading();
      }
    );
  }
  
  
}
