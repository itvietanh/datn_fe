import { DatePipe } from '@angular/common';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MessageService } from 'common/base/service/message.service';
import { HotelService } from 'common/share/src/service/application/hotel/hotel.service';
import { ValidatorExtension } from 'common/validator-extension';
import { DialogService } from 'share';
import { RoomtypeStatistics } from 'common/share/src/service/application/hotel/roomtypestatistical';
import { ChartConfiguration } from 'chart.js';



@Component({
  selector: 'app-roomtype',
  templateUrl: './roomtype.component.html',
  styleUrls: ['./roomtype.component.scss']
})
export class RoomTypeComponent implements OnInit, OnChanges {
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
        text: 'Thống kê loại phòng',
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
    public RoomtypeStatistics: RoomtypeStatistics,
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

    try {
        const res = await this.RoomtypeStatistics.getTransactionsByDate(params).firstValueFrom();
        if (res && Array.isArray(res.data)) {
            const dataStatistical = res.data;
            this.chartData = {
                labels: dataStatistical.map((item: any) => item.type_name),
                datasets: [
                    {
                        label: 'Số lượng phòng',
                        data: dataStatistical.map((item: any) => item.total_room),
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgb(75, 192, 192)',
                        borderWidth: 1,
                    },
                ],
            };
            this.messageService.notiMessageSuccess('Lấy dữ liệu thành công!');
        } else {
            throw new Error('Dữ liệu trả về không hợp lệ');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        this.messageService.notiMessageError('Lỗi khi lấy dữ liệu thống kê.');
    } finally {
        this.dialogService.closeLoading();
    }
  }


  async refreshData(): Promise<void> {
    this.loading = true;
    this.error = null;
    try {
        await this.getData();
    } catch (err) {
        this.error = 'Không thể tải dữ liệu. Vui lòng thử lại.';
    } finally {
        this.loading = false;
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
      const res: any = await this.RoomtypeStatistics.exportExcelTrans(params).firstValueFrom();

      const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'thong-ke-loai-phong.xlsx';
      a.click();

      this.messageService.notiMessageSuccess('Kết xuất dữ liệu thành công');
    } catch (error) {
      console.error(error);
      this.messageService.notiMessageError('Kết xuất dữ liệu thất bại');
    } finally {
      this.dialogService.closeLoading();
    }
  }
  public getTransactionStatisticsByDate() {
    this.dialogService.openLoading();
    const params = this.formSearch.getRawValue();

    this.RoomtypeStatistics.getTransactionsByDate(params).subscribe(
      (response) => {
        this.chartData = {
          labels: response.data.map((item: any) => item.date),
          datasets: [
            {
              label: "Tổng tiền",
              data: response.data.map((item: any) => item.total_amount),
              borderColor: "rgb(75, 192, 192)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              fill: true
            }
          ]
        };
        this.dialogService.closeLoading();
      },
      (error) => {
        this.error = 'Lỗi khi lấy dữ liệu thống kê giao dịch.';
        this.dialogService.closeLoading();
      }
    );
  }

}
