import { DatePipe } from '@angular/common';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MessageService } from 'common/base/service/message.service';
import { HotelService } from 'common/share/src/service/application/hotel/hotel.service';
import { ValidatorExtension } from 'common/validator-extension';
import { DialogService } from 'share';
import { ChartConfiguration } from 'chart.js';
import { RoomtypeStatistics } from 'common/share/src/service/application/hotel/roomtypestatistical';

@Component({
  selector: 'app-roomtype',
  templateUrl: './roomtype.component.html',
  styleUrls: ['./roomtype.component.scss'],
})
export class RoomTypeComponent implements OnInit, OnChanges {
  public formSearch!: FormGroup;
  timeFilter: string = 'daily';
  chartType: string = 'bar';
  loading: boolean = false;
  error: string | null = null;

  listChartType: any[] = [
    { value: 'bar', label: 'Biều đồ cột' },
    { value: 'line', label: 'Biều đồ đường kẻ' },
  ];

  chartData: any = {
    labels: [],
    datasets: [],
  };

  options: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Thống kê loại phòng',
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 1,
        max: 35,
        ticks: {
          stepSize: 10,
          callback: function (value) {
            return value.toLocaleString('vi-VN', { maximumFractionDigits: 0 });
          },
        },
      },
    },
  };

  constructor(
    private fb: FormBuilder,
    private dialogService: DialogService,
    private messageService: MessageService,
    public hotelService: HotelService,
    private datePipe: DatePipe,
    public roomtypestatistical: RoomtypeStatistics
  ) {

  }

  ngOnInit(): void {
    this.getTotalRoomsByHotel();
  }

  public getTotalRoomsByHotel() {
    this.dialogService.openLoading();
    this.roomtypestatistical.getTotalRoomsByHotel().subscribe(
      (response) => {
        this.chartData = {
          labels: response.data.map((item: any) => item.room_type_name),
          datasets: [
            {
              label: 'Số phòng',
              data: response.data.map((item: any) => item.total_rooms),
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: true,
            },
          ],
        };
        this.dialogService.closeLoading();
        
      },
      (error) => {
        this.error = 'Lỗi khi lấy dữ liệu thống kê.';
        this.dialogService.closeLoading();
      }
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartType']) {
      this.renderChart(this.chartType);
    }
  }

  renderChart(chartType: string = '') {
    this.dialogService.openLoading();
    this.chartType = chartType;
    // Dưới đây là việc thực sự render lại biểu đồ nếu cần
    // Bạn có thể thêm logic cập nhật biểu đồ cho các loại khác nhau ở đây.
    this.dialogService.closeLoading();
  }

  async handleExportExcel() {
    this.dialogService.openLoading();
    const params = this.formSearch.getRawValue();

    try {
      const res: any = await this.roomtypestatistical
        .exportExcelTrans(params)
        .firstValueFrom();
      const blob = new Blob([res], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
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
}
