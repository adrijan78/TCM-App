import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NgxChartsModule,
  ScaleType,
  LegendPosition,
} from '@swimlane/ngx-charts'; // Import ScaleType

import { MatTabsModule } from '@angular/material/tabs'; // Import MatTabsModule

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [CommonModule, NgxChartsModule, MatTabsModule],

  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],
})
export class MemberDetailComponent implements OnInit {
  // --- Profile Data (from image) ---
  userName: string = 'Име и презиме:'; // As per image
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
  barChartData: any[] = [
    { name: 'January', value: 5 },
    { name: 'February', value: 12 },
    { name: 'March', value: 8 },
    { name: 'April', value: 12 },
  ];

  // Pie Chart Data (matching "Skipped" and "Attended" from image)
  pieChartData: any[] = [
    { name: 'Skipped', value: 28.6 }, // Values based on image percentages
    { name: 'Attended', value: 71.4 },
  ];

  pieChartDataForPayment: any[] = [
    { name: 'Payed', value: 82 }, // Values based on image percentages
    { name: 'Not payed', value: 18 },
  ];

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
    domain: ['#61DAFB', '#00BCD4'], // Cyan and a slightly darker cyan/teal
  };

  pieChartColorSchemeForPayment = {
    name: 'cyanScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#61DAFB', '#00BCD4'], // Cyan and a slightly darker cyan/teal
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

  pieChartOptionsForPayment = {
    labels: true, // Show labels (e.g., 'Skipped', 'Attended')
    doughnut: true, // Make it a doughnut chart
    arcWidth: 0.65, // Adjust width of doughnut ring for better look
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

  // --- Table Data (empty as per image, but structured) ---
  dataSource = [
    { col1: '', col2: '', col3: '' },
    { col1: '', col2: '', col3: '' },
    { col1: '', col2: '', col3: '' },
    { col1: '', col2: '', col3: '' },
  ];
  dataSourceForPayment = [
    { col1: '', col2: '', col3: '' },
    { col1: '', col2: '', col3: '' },
    { col1: '', col2: '', col3: '' },
    { col1: '', col2: '', col3: '' },
  ];
  dataSourceForLineChart: any[] = [
    {
      col1: '2024-01-15',
      col2: 'Sparring',
      col3: '1hr',
      performanceStatus: 'good',
      performanceScore: 85,
      notes: 'Good session',
    },
    {
      col1: '2024-02-01',
      col2: 'Drills',
      col3: '45min',
      performanceStatus: 'average',
      performanceScore: 70,
      notes: 'Needs improvement',
    },
    {
      col1: '2024-03-10',
      col2: 'Conditioning',
      col3: '1hr 15min',
      performanceStatus: 'good',
      performanceScore: 92,
      notes: 'Strong performance',
    },
    {
      col1: '2024-04-05',
      col2: 'Sparring',
      col3: '1hr 30min',
      performanceStatus: 'poor',
      performanceScore: 55,
      notes: 'Tired, low energy',
    },
    {
      col1: '2024-05-20',
      col2: 'Technique',
      col3: '1hr',
      performanceStatus: 'average',
      performanceScore: 68,
      notes: 'Focus on fundamentals',
    },
    {
      col1: '2024-06-01',
      col2: 'Sparring',
      col3: '1hr',
      performanceStatus: 'good',
      performanceScore: 78,
      notes: 'Improved a bit',
    },
    {
      col1: '2024-07-10',
      col2: 'Drills',
      col3: '45min',
      performanceStatus: 'good',
      performanceScore: 88,
      notes: 'Very focused',
    },
    {
      col1: '2024-08-05',
      col2: 'Conditioning',
      col3: '1hr',
      performanceStatus: 'average',
      performanceScore: 65,
      notes: 'Lower energy',
    },
    {
      col1: '2024-09-15',
      col2: 'Sparring',
      col3: '1hr 20min',
      performanceStatus: 'good',
      performanceScore: 95,
      notes: 'Excellent session',
    },
    {
      col1: '2024-10-01',
      col2: 'Technique',
      col3: '1hr',
      performanceStatus: 'average',
      performanceScore: 72,
      notes: 'Consistent',
    },
    {
      col1: '2024-11-20',
      col2: 'Sparring',
      col3: '1hr 10min',
      performanceStatus: 'poor',
      performanceScore: 40,
      notes: 'Struggled a lot',
    },
    {
      col1: '2024-12-05',
      col2: 'Drills',
      col3: '50min',
      performanceStatus: 'good',
      performanceScore: 80,
      notes: 'Strong finish to the year',
    },
  ];

  constructor() {}

  ngOnInit(): void {
    this.generateLineChartData();
  }

  generateLineChartData(): void {
    // Ngx-charts line chart expects data as an array of series.
    // For a single member's performance, we'll have one series.
    this.lineChartData = [
      {
        name: 'Performance Score', // Name of the series (appears in legend)
        series: this.dataSourceForLineChart
          .map((row) => ({
            // 'name' for line chart should be a Date object for timeline functionality
            name: new Date(row.col1), // Convert date string (col1) to Date object
            value: row.performanceScore, // Your performance score from the data source
          }))
          .sort((a, b) => a.name.getTime() - b.name.getTime()), // Sort by date for correct line display
      },
    ];

    console.log('Generated lineChartData:', this.lineChartData); // For debugging
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
}
