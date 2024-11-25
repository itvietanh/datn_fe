import { DatePipe } from '@angular/common';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MessageService } from 'common/base/service/message.service';
import { HotelService } from 'common/share/src/service/application/hotel/hotel.service';
import { ValidatorExtension } from 'common/validator-extension';
import { DialogService } from 'share';
import { ChartConfiguration } from 'chart.js';
import { Employeestatistics } from 'common/share/src/service/application/hotel/employeestatistics';



@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit, OnChanges {
  public formSearch!: FormGroup;
  timeFilter: string = 'daily';
  chartType: string = 'bar';
  loading: boolean = false;
  error: string | null = null;


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
        text: 'Thống kê giao dịch',
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    scales: {
      y: {
        beginAtZero: false, 
        min: 1, 
        max: 100, 
        ticks: {
          stepSize: 10, 
          callback: function (value) {
            return value.toLocaleString('vi-VN', { maximumFractionDigits: 0 }); 
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
    public employeestatistics: Employeestatistics,
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
    const res = await this.employeestatistics.getDataStatisticalTrans(params).firstValueFrom();
    const dataStatistical = res.data.statistical;

    this.chartData = {
      labels: dataStatistical.map((item: any) => item.transitionDate),
      datasets: [
        {
          label: "Tổng số lượng nhân viên ",
          data: dataStatistical.map((item: any) => item.totalAmount),
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
      const res: any = await this.employeestatistics.exportExcelTrans(params).firstValueFrom();

      const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'thong-ke-nhan-vien.xlsx';
      a.click();

      this.messageService.notiMessageSuccess('Kết xuất dữ liệu thành công');
    } catch (error) {
      console.error(error);
      this.messageService.notiMessageError('Kết xuất dữ liệu thất bại');
    } finally {
      this.dialogService.closeLoading();
    }
  }
}
