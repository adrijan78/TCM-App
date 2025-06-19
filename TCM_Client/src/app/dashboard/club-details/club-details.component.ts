import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import { LegendPosition, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-club-details',
  imports: [MatCardModule,MatIconModule,NgxChartsModule],
  templateUrl: './club-details.component.html',
  styleUrl: './club-details.component.css'
})
export class ClubDetailsComponent {

    barChartColorScheme = {
      name: 'blueGradientScheme',
      selectable: true,
      group: ScaleType.Ordinal,
      domain: ['#5484a4', '#417298', '#2e608c', '#1b4d80'], // Shades of blue for bars
    };
     commonChartOptions = {
        legendPosition: LegendPosition.Below, // Image shows legend above the chart
        animations: true,
        roundDomains: true,
        tooltipDisabled: false, // Ensure tooltips are enabled
      };
    barChart1Options = {
    xAxisLabel: 'Training Discipline',
    yAxisLabel: 'Sessions',
    barPadding: 8,
    roundDomains: true,
  };
   barChartData: any[] = [
    { name: 'January', value: 5 },
    { name: 'February', value: 12 },
    { name: 'March', value: 8 },
    { name: 'April', value: 12 },
  ];
    showXAxis = true;
  showYAxis = true;
  gradient = false; // Set to false to control colors explicitly if no gradient is desired, or true for ngx-charts' default gradient
  showLegend = true;
  showXAxisLabel = false; // Image doesn't show axis labels "Item 1", etc. are category labels
  showYAxisLabel = false; // Image doesn't show axis labels
  xAxisLabel = ''; // Not used if showXAxisLabel is false
  yAxisLabel = ''; // Not used if showYAxisLabel is false
}
