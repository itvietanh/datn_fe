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
import { TransitionStatistics } from 'common/share/src/service/application/hotel/transitionstatistics';
import { ChartConfiguration } from 'chart.js';



@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit, OnChanges {

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
        text: 'Thống kê giao dịch'
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

  constructor( 
    private fb: FormBuilder,
    private dialogService: DialogService,
    private messageService: MessageService,
    public hotelService: HotelService,
    private datePipe: DatePipe,
    public transitionstatistics: TransitionStatistics,
  ) { }

  ngOnInit(): void {
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

}
