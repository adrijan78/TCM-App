import { Component, inject, model, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  LegendPosition,
  NgxChartsModule,
  ScaleType,
} from '@swimlane/ngx-charts';
import { CardComponent } from '../../_shared/card/card/card.component';
import { NoteComponent } from '../notes/note/note.component';
import { MatCardModule } from '@angular/material/card';
import {
  MatCalendarCellClassFunction,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { CountdownTimerComponent } from '../../UI/countdown-timer/countdown-timer.component';
import { ClubNumbersInfo } from '../../_models/ClubNumbersInfo';
import { SharedService } from '../../_services/shared.service';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { Training } from '../../_models/Training';
import { TrainingService } from '../../_services/training/training.service';

@Component({
  selector: 'app-club-details',
  providers: [provideNativeDateAdapter()],
  imports: [
    MatIconModule,
    MatTabsModule,
    NgxChartsModule,
    CardComponent,
    NoteComponent,
    MatCardModule,
    MatDatepickerModule,
    CountdownTimerComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatExpansionModule,
  ],
  templateUrl: './club-details.component.html',
  styleUrl: './club-details.component.css',
})
export class ClubDetailsComponent implements OnInit {
  sharedSevice = inject(SharedService);
  trainingService = inject(TrainingService);
  selected = model<Date | null>(null);
  trainingsByMonth = signal<[] | null>(null);
  clubNumbersInfo = signal<ClubNumbersInfo | null>(null);
  year = new Date().getFullYear();
  years = Array.from({ length: this.year - 1980 + 1 }, (_, i) => this.year - i);
  month: number | null = null;
  selectedDate: Date | null = null;
  trainingsForCalendar = signal<Training[] | null>(null);
  displayedMonth: string = new Date().getMonth().toString();
  nextTraining: Date | undefined = undefined;

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
  barChartData = signal<any[]>([]);
  showXAxis = true;
  showYAxis = true;
  gradient = false; // Set to false to control colors explicitly if no gradient is desired, or true for ngx-charts' default gradient
  showLegend = true;
  showXAxisLabel = false; // Image doesn't show axis labels "Item 1", etc. are category labels
  showYAxisLabel = false; // Image doesn't show axis labels
  xAxisLabel = ''; // Not used if showXAxisLabel is false
  yAxisLabel = ''; // Not used if showYAxisLabel is false

  ngOnInit(): void {
    this.getClubNumbersInfo();
    this.getClubTrainingsAttendance();
    this.getTrainingsForMonth(+this.displayedMonth);
  }

  refetchData() {
    this.getClubNumbersInfo();
    this.getClubTrainingsAttendance();
  }

  getClubNumbersInfo() {
    return this.sharedSevice
      .getClubNumbersInfo(this.year, this.month)
      .subscribe({
        next: (response: any) => {
          this.clubNumbersInfo.set(response);
        },
        error: (error) => {
          console.error('Error fetching club numbers info:', error);
        },
      });
  }

  getClubTrainingsAttendance() {
    return this.sharedSevice.getClubTrainingsAttendance(this.year).subscribe({
      next: (response: any) => {
        // Handle the response here
        this.trainingsByMonth.set(response);
        this.countTrainingAttendanceByMonth();
      },
      error: (error) => {
        console.error('Error fetching club trainings attendance:', error);
      },
    });
  }

  dateClass: MatCalendarCellClassFunction<Date> = (
    date: Date,
    view: 'month' | 'year' | 'multi-year'
  ) => {
    // Only apply custom classes for the 'month' view
    if (view === 'month') {
      let hasTraining = false;
      // this.trainings()?.some(
      //   (training) => {
      //     new Date(training.date).toDateString() == date.toDateString()
      //   }
      // );
      for (let training of this.trainingsForCalendar()!) {
        if (new Date(training.date).toDateString() == date.toDateString()) {
          hasTraining = true;
          break;
        }
      }
      return hasTraining ? 'has-training' : '';
    }
    return ''; // No custom class for 'year' or 'multi-year' views
  };

  getTrainingsForMonth(month: number) {
    var correctedMonth = month + 1;
    debugger;
    this.trainingService.getTrainingsForMonth(correctedMonth).subscribe({
      next: (res: any) => {
        let response = res;
        this.trainingsForCalendar.set(response);

        this.forceReloadCalendarSelectedDates();
        // this.onDateSelected(new Date());
        // if (this.initialPull() == false) {
        //   this.calendar()?.updateTodaysDate();
        // } else {
        //   this.initialPull.set(false);
        // }
      },
      error: (err) => {},
    });
  }

  forceReloadCalendarSelectedDates() {
    this.dateClass = (date: Date, view: 'month' | 'year' | 'multi-year') => {
      // Only apply custom classes for the 'month' view
      if (view === 'month') {
        let hasTraining = false;
        // this.trainings()?.some(
        //   (training) => {
        //     new Date(training.date).toDateString() == date.toDateString()
        //   }
        // );
        for (let training of this.trainingsForCalendar()!) {
          if (new Date(training.date).toDateString() == date.toDateString()) {
            hasTraining = true;
            break;
          }
        }
        return hasTraining ? 'has-training' : '';
      }
      return ''; // No custom class for 'year' or 'multi-year' views
    };
  }

  resetFilters() {
    this.month = null;
    this.refetchData();
  }

  countTrainingAttendanceByMonth() {
    debugger;
    this.barChartData.set([]);

    const tmp2 = this.trainingsByMonth();
    for (let item in tmp2) {
      let it = +item;
      let record = { name: this.getMonthName(it), value: tmp2[it] };

      this.barChartData.update((prev: any) => [...prev, record]);
      console.log(this.barChartData());
    }
  }

  getMonthName(monthNumber: number): string {
    const date = new Date(2000, monthNumber - 1); // Months are 0-indexed in JavaScript
    return date.toLocaleString('mk-MK', { month: 'long' });
  }
}
