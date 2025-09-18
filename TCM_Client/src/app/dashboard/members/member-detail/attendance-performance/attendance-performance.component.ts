import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  LegendPosition,
  NgxChartsModule,
  ScaleType,
} from '@swimlane/ngx-charts';
import { MemberTrainingData } from '../../../../_models/MemberTrainingData';
import { ToastrService } from 'ngx-toastr';
import { MemberService } from '../../../../_services/member/member.service';
import { SharedService } from '../../../../_services/shared.service';
import { TrainingService } from '../../../../_services/training/training.service';

@Component({
  selector: 'app-attendance-performance',
  imports: [
    CommonModule,
    NgxChartsModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatPaginatorModule,
    MatButtonModule,
    RouterModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './attendance-performance.component.html',
  styleUrl: './attendance-performance.component.css',
})
export class AttendancePerformanceComponent implements OnInit {
  memberService = inject(MemberService);
  trainingService = inject(TrainingService);
  toast = inject(ToastrService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  sharedService = inject(SharedService);

  id = signal<number | string>(0);
  year = new Date().getFullYear();
  years = Array.from({ length: this.year - 1980 + 1 }, (_, i) => this.year - i);
  trainingsByMonth = signal<[] | null>(null);
  memberTrainingAttendanceByMonth = signal<Record<number, number> | null>(null);
  memberTotalNumOfTrainings = signal<number>(0);
  clubTotalNumOfTrainings = signal<number>(0);
  attendancePercentage = signal<number>(0);
  pageSizeOptions = [5, 10, 20, 50];
  pageSize = 5; // број на членови по страница
  pageNumber = 1;

  // --- Profile Data (from image) ---
  userAge: string = 'Години:'; // As per image
  userEmail: string = 'Емаил:'; // As per image
  joinDate: string = 'Во клубот од:'; // As per image
  userBelt: string = 'Појас:'; // As per image

  lineChartData: any[] = [];
  lineChartColorScheme = {
    name: 'lineChartSchema',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#007bff', '#A10A28', '#C7B42C'],
  };
  lineXAxisLabel = 'Training Date';
  lineYAxisLabel = 'Performance Score';
  autoScale = true; // Auto-scales the Y-axis based on data
  timeline = true; // Enables timeline/zooming features for date-based data

  // --- ngx-charts Data ---
  // Bar Chart Data (matching "Item 1, 2, 3, 4" from image)
  barChartData = signal<any[]>([]);

  // Pie Chart Data (matching "Skipped" and "Attended" from image)

  // --- ngx-charts Common Options ---
  // We'll rely on CSS for responsiveness, no 'view' property needed here.
  showXAxis = true;
  showYAxis = true;
  gradient = false; // Set to false to control colors explicitly if no gradient is desired, or true for ngx-charts' default gradient
  showLegend = true;
  showXAxisLabel = false; // Image doesn't show axis labels "Item 1", etc. are category labels
  showYAxisLabel = false; // Image doesn't show axis labels
  xAxisLabel = ''; // Not used if showXAxisLabel is false
  yAxisLabel = ''; // Not used if showYAxisLabel is false

  // Custom Color Schemes to match the image
  barChartColorScheme = {
    name: 'blueGradientScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5484a4', '#417298', '#2e608c', '#1b4d80'], // Shades of blue for bars
  };

  pieChartColorScheme = {
    name: 'cyanScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#00BCD4', '#88e4fdff'], // Cyan and a slightly darker cyan/teal
  };

  // Common ngx-charts options that can be shared across charts
  commonChartOptions = {
    legendPosition: LegendPosition.Below, // Image shows legend above the chart
    animations: true,
    roundDomains: true,
    tooltipDisabled: false, // Ensure tooltips are enabled
  };

  // Specific Pie Chart Options
  pieChartOptions = {
    labels: true, // Show labels (e.g., 'Skipped', 'Attended')
    doughnut: true, // Make it a doughnut chart
    arcWidth: 0.55, // Adjust width of doughnut ring for better look
    labelFormatting: (value: any) => {
      return `${value.value}%`; // Format percentage TooltipLabelStyle
    },
  };

  barChart2Options = {
    xAxisLabel: 'Training Discipline',
    yAxisLabel: 'Sessions',
    barPadding: 8,
    roundDomains: true,
  };
  barChart1Options = {
    xAxisLabel: 'Training Discipline',
    yAxisLabel: 'Sessions',
    barPadding: 8,
    roundDomains: true,
  };

  pieChartData: any[] = [];
  // --- Table Data (empty as per image, but structured) ---
  dataSource: MemberTrainingData[] = [
    // { col1: '', col2: '', col3: '' },
  ];

  dataSourceForLineChart: MemberTrainingData[] = [
    // {
    //   col1: '2024-01-15',
    //   performanceStatus: 'good',
    //   performanceScore: 85,
    //   notes: 'Good session',
    // },
    // {
    //   col1: '2024-02-01',
    //   performanceStatus: 'average',
    //   performanceScore: 70,
    //   notes: 'Needs improvement',
    // },
  ];

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe((params: any) => {
      this.id.set(+params.get('id'));
      this.getMemberTrainingData();
    });
  }
  getMemberTrainingData() {
    this.clubTotalNumOfTrainings.set(0);
    this.memberTotalNumOfTrainings.set(0);
    this.attendancePercentage.set(0);
    this.barChartData.set([]);
    this.memberService
      .getMemberTrainingData(
        +this.id(),
        this.year,
        this.pageNumber,
        this.pageSize
      )
      .subscribe({
        next: (res) => {
          this.dataSourceForLineChart = res.body as MemberTrainingData[];
          this.dataSource = res.body as MemberTrainingData[];
          this.getNumberOfTrainingsForEveryMonth();

          this.generateLineChartData();
        },
        error: (err) => console.log(err),
      });
  }
  getNumberOfTrainingsForEveryMonth() {
    this.trainingService
      .getNumberOfAttendedMemberTrainingsForEveryMonth(this.year, +this.id())
      .subscribe({
        next: (res: any) => {
          this.trainingsByMonth.set(res);
          this.countMemberAttendanceByMonth();
          this.getClubNumberOfTrainings();
        },
        error: (err) => {},
      });
  }

  refetchData() {
    this.attendancePercentage.set(0);
    this.memberTotalNumOfTrainings.set(0);
    this.clubTotalNumOfTrainings.set(0);
    this.barChartData.set([]);
    this.getMemberTrainingData();
  }

  getClubNumberOfTrainings() {
    this.sharedService.getClubNumberOfTrainings(this.year, null).subscribe({
      next: (res: any) => {
        this.clubTotalNumOfTrainings.set(res);
        this.getTotalNumberOfTrainings();
      },
    });
  }

  countMemberAttendanceByMonth() {
    this.barChartData.set([]);

    const tmp2 = this.trainingsByMonth();
    for (let item in tmp2) {
      let it = +item;
      let record = { name: this.getMonthName(it), value: tmp2[it] };

      this.barChartData.update((prev: any) => [...prev, record]);
    }
  }

  getTotalNumberOfTrainings() {
    let tmp = this.trainingsByMonth();
    for (let item in tmp) {
      let it = tmp[+item];

      this.memberTotalNumOfTrainings.update((value) => value + it);
    }
    let perc =
      (this.memberTotalNumOfTrainings() / this.clubTotalNumOfTrainings()) *
      100.0;
    debugger;
    console.log(
      'Perc',
      perc,
      this.memberTotalNumOfTrainings(),
      this.clubTotalNumOfTrainings()
    );
    this.attendancePercentage.set(+perc.toFixed(1));
    this.pieChartData = [
      {
        name: `Присуство`,
        value:
          this.attendancePercentage() != null
            ? this.attendancePercentage()!
            : 90,
      },
      {
        name: 'Отсутство',
        value:
          this.attendancePercentage() != null
            ? 100 - this.attendancePercentage()!
            : 10,
      },
    ];
  }

  generateLineChartData(): void {
    // Ngx-charts line chart expects data as an array of series.
    // For a single member's performance, we'll have one series.
    this.lineChartData = [
      {
        name: 'Оцена за перформанси', // Name of the series (appears in legend)
        series: this.dataSourceForLineChart
          .map((row) => ({
            // 'name' for line chart should be a Date object for timeline functionality
            name: new Date(row.date), // Convert date string (col1) to Date object
            value: row.performace, // Your performance score from the data source
          }))
          .sort((a, b) => a.name.getTime() - b.name.getTime()), // Sort by date for correct line display
      },
    ];

    console.log('Generated lineChartData:', this.lineChartData); // For debugging
  }

  getMonthName(monthNumber: number): string {
    const date = new Date(2000, monthNumber - 1); // Months are 0-indexed in JavaScript
    return date.toLocaleString('mk-MK', { month: 'long' });
  }

  // --- ngx-charts Event Handlers (Optional, retained for interactivity) ---
  onSelect(event: any): void {
    console.log('Item selected:', event);
  }

  onActivate(data: any): void {
    console.log('Activate:', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate:', JSON.parse(JSON.stringify(data)));
  }

  onPageChange(ev: any) {
    if (this.pageNumber !== ev.pageIndex + 1 || this.pageSize !== ev.pageSize) {
      this.pageNumber = ev.pageIndex + 1;
      this.pageSize = ev.pageSize;
      this.getMemberTrainingData();
    }
  }
}
