import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  LegendPosition,
  NgxChartsModule,
  ScaleType,
} from '@swimlane/ngx-charts';

@Component({
  selector: 'app-membership-fee',
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './membership-fee.component.html',
  styleUrl: './membership-fee.component.css',
})
export class MembershipFeeComponent {
  gradient = false;
  showLegend = true;

  commonChartOptions = {
    legendPosition: LegendPosition.Below, // Image shows legend above the chart
    animations: true,
    roundDomains: true,
    tooltipDisabled: false, // Ensure tooltips are enabled
  };

  pieChartOptionsForPayment = {
    labels: true, // Show labels (e.g., 'Skipped', 'Attended')
    doughnut: true, // Make it a doughnut chart
    arcWidth: 0.65, // Adjust width of doughnut ring for better look
    labelFormatting: (value: any) => {
      return `${value.value}%`; // Format percentage TooltipLabelStyle
    },
  };

  pieChartDataForPayment: any[] = [
    { name: 'Платено', value: 82 }, // Values based on image percentages
    { name: 'Не платено', value: 18 },
  ];

  pieChartColorSchemeForPayment = {
    name: 'cyanScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#61DAFB', '#00BCD4'], // Cyan and a slightly darker cyan/teal
  };

  dataSourceForPayment = [
    { col1: '', col2: '', col3: '' },
    { col1: '', col2: '', col3: '' },
    { col1: '', col2: '', col3: '' },
    { col1: '', col2: '', col3: '' },
  ];

  onSelect(event: any): void {
    console.log('Item selected:', event);
  }
}
