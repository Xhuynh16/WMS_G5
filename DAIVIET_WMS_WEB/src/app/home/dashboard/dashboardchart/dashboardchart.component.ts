import { Component, OnInit } from '@angular/core';
declare var google: any;
@Component({
  selector: 'app-dashboardchart',
  standalone: true,
  imports: [],
  templateUrl: './dashboardchart.component.html',
  styleUrl: './dashboardchart.component.scss',
  template: `
  <div class="chart-container">
    <nz-divider nzOrientation="left" nzText="THỐNG KÊ THEO BIỂU ĐỒ"></nz-divider>
    
    <div nz-row [nzGutter]="{ xs: 8, sm: 16, md: 24, lg: 32 }">
      <div nz-col [nzSpan]="6">
        <nz-card>
          <div id="columnChart" style="width: 100%; min-height: 400px;"></div>
        </nz-card>
      </div>
      <div nz-col [nzSpan]="6">
        <nz-card>
          <div id="pieChart" style="width: 100%; min-height: 400px;"></div>
        </nz-card>
      </div>
    </div>
    
    <div nz-row [nzGutter]="{ xs: 8, sm: 16, md: 24, lg: 32 }" class="mt-4">
      <div nz-col [nzSpan]="6">
        <nz-card>
          <div id="lineChart" style="width: 100%; min-height: 400px;"></div>
        </nz-card>
      </div>
    </div>
  </div>
`,
styles: [`
  .chart-container {
    margin-top: 24px;
  }
  .mt-4 {
    margin-top: 24px;
  }
`]
})
export class DashboardchartComponent implements OnInit {
  private columnData = [
    ['Loại', 'Số lượng'],
    ['Hàng tồn kho', 54],
    ['Yêu cầu xuất kho', 16],
    ['Yêu cầu nhập kho', 8],
    ['Sự cố phát sinh', 12]
  ];

  private pieData = [
    ['Trạng thái', 'Số lượng'],
    ['Lệnh trễ hạn', 17],
    ['Lệnh đang thực hiện', 10],
    ['Lệnh mới', 3],
  ];

  private lineData = [
    ['Tháng', 'Hàng tồn kho', 'Yêu cầu xuất', 'Yêu cầu nhập'],
    ['T1', 50, 15, 7],
    ['T2', 54, 16, 8],
    ['T3', 48, 14, 6],
    ['T4', 52, 17, 9],
    ['T5', 55, 18, 10],
    ['T6', 54, 16, 8],
  ];

  ngOnInit() {
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(() => {
      this.drawAllCharts();
      // Xử lý responsive
      window.addEventListener('resize', () => {
        this.drawAllCharts();
      });
    });
  }

  private drawAllCharts() {
    this.drawColumnChart();
    this.drawPieChart();
    this.drawLineChart();
  }

  private drawColumnChart() {
    const data = google.visualization.arrayToDataTable(this.columnData);
    const options = {
      title: 'Thống kê tổng quan',
      colors: ['#32c5d2', '#c49f47', '#32c5d2', '#c49f47'],
      animation: {
        duration: 1000,
        easing: 'out'
      },
      hAxis: {
        title: 'Loại'
      },
      vAxis: {
        title: 'Số lượng'
      },
      legend: { position: 'none' }
    };

    const chart = new google.visualization.ColumnChart(
      document.getElementById('columnChart')
    );
    chart.draw(data, options);
  }

  private drawPieChart() {
    const data = google.visualization.arrayToDataTable(this.pieData);
    const options = {
      title: 'Phân bổ trạng thái lệnh',
      colors: ['#c49f47', '#32c5d2', '#4CAF50'],
      is3D: true
    };

    const chart = new google.visualization.PieChart(
      document.getElementById('pieChart')
    );
    chart.draw(data, options);
  }

  private drawLineChart() {
    const data = google.visualization.arrayToDataTable(this.lineData);
    const options = {
      title: 'Xu hướng theo thời gian',
      colors: ['#32c5d2', '#c49f47', '#4CAF50'],
      curveType: 'function',
      legend: { position: 'bottom' },
      hAxis: {
        title: 'Tháng'
      },
      vAxis: {
        title: 'Số lượng'
      }
    };

    const chart = new google.visualization.LineChart(
      document.getElementById('lineChart')
    );
    chart.draw(data, options);
  }
}
