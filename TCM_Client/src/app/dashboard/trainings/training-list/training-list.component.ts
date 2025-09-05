import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  effect,
  inject,
  OnInit,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDatepickerModule,
  MatCalendarCellClassFunction,
  MatCalendar,
} from '@angular/material/datepicker'; // Import MatCalendarCellClassFunction
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { AddTrainingComponent } from '../add-training/add-training.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { Training, TrainingDetails } from '../../../_models/Training';
import { MatPaginatorModule } from '@angular/material/paginator';
import { TrainingService } from '../../../_services/training/training.service';
import { TrainingStatus } from '../../../_models/_enums/TrainingStatus';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, NgModel } from '@angular/forms';
import { Pagination } from '../../../_models/Pagination';
import { Router, RouterLink, RouterModule } from '@angular/router';

// Define your Training interface for better type safety

@Component({
  selector: 'app-training-list',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatTabsModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './training-list.component.html',
  styleUrls: ['./training-list.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TrainingListComponent implements OnInit, AfterViewInit {
  trainingService = inject(TrainingService);
  router = inject(Router);
  activeTraining = TrainingStatus.Active;
  canceledTraining = TrainingStatus.Canceled;
  finishedTraining = TrainingStatus.Finished;

  trainings = signal<Training[] | null>(null);
  trainingsForCalendar = signal<Training[] | null>(null);
  selectedDate: Date | null = null;
  searchTermCalendar: string = '';
  totalTrainings = 0;
  pageSize = 5;
  pageNumber = 1;
  pageSizeOptions = [5, 10, 20, 50];
  selectedStatus = <number | null>null;
  selectedType = signal<number | null>(null);
  searchTerm = signal<string>('');
  selectedTraining = signal<TrainingDetails | null>(null);
  calendar = viewChild(MatCalendar<Date>);
  displayedMonth: string = new Date().getMonth().toString();
  initialPull = signal<boolean>(true);

  constructor(private dialog: MatDialog) {
    effect(() => {
      const cal = this.calendar(); // unwrap the signal
      if (cal) {
        cal.stateChanges.subscribe(() => {
          var tmp = cal.activeDate.getMonth().toString();
          if (tmp != this.displayedMonth) {
            this.displayedMonth = tmp;
            this.getTrainingsForMonth(+this.displayedMonth);
          }
        });
      }
    });
  }

  ngOnInit(): void {
    this.selectedDate = new Date();
    this.getTrainings();

    this.getTrainingsForMonth(+this.displayedMonth);
  }

  ngAfterViewInit(): void {}

  getTrainings() {
    this.trainingService
      .getTrainingsByMoths(
        this.pageNumber,
        this.pageSize,
        this.selectedStatus,
        this.selectedType(),
        this.searchTerm()
      )
      .subscribe({
        next: (res) => {
          let response = res.body as Training[] | null;
          this.trainings.set(response);
          // this.onDateSelected(new Date(), this.trainings);
          let pagination: Pagination = JSON.parse(
            res.headers.get('Pagination')!
          );
          this.pageNumber = pagination.currentPage!;
          this.pageSize = pagination.itemsPerPage!;
          this.totalTrainings = pagination.totalItems!;
          //this.forceReloadCalendarSelectedDates(response);
          //this.getTrainingsForSelectedDate();
        },
      });
  }

  getTrainingDetails(id: number) {
    this.trainingService.getTraining(id).subscribe({
      next: (res: TrainingDetails) => {
        this.selectedTraining.set(res);
      },
    });
  }

  getTrainingsForMonth(month: number) {
    var correctedMonth = month + 1;
    this.trainingService.getTrainingsForMonth(correctedMonth).subscribe({
      next: (res: any) => {
        let response = res;
        this.trainingsForCalendar.set(response);

        this.forceReloadCalendarSelectedDates();
        this.onDateSelected(new Date());
        if (this.initialPull() == false) {
          this.calendar()?.updateTodaysDate();
        } else {
          this.initialPull.set(false);
        }
      },
      error: (err) => {},
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

  /**
   * Handles date selection on the calendar.
   */
  onDateSelected(date: Date | null): void {
    if (
      this.trainingsForCalendar() != null &&
      this.trainingsForCalendar() != undefined &&
      this.trainingsForCalendar()!.length > 0
    ) {
      for (let training of this.trainingsForCalendar()!) {
        if (
          date != null &&
          new Date(training.date).toDateString() == date?.toDateString()
        ) {
          this.getTrainingDetails(training.id);
          break;
        }
        this.selectedTraining.set(null);
      }
    } else {
      this.selectedTraining.set(null);
    }

    this.selectedDate = date;
  }

  /**
   * Opens the dialog to add a new training for the selected date.
   * @param date The date for which to add a training.
   */
  openAddTrainingDialog(date: Date | null): void {
    if (!date) {
      alert(
        'Please select a date on the calendar first or choose one to add a training.'
      );
      return;
    }

    const dialogRef = this.dialog.open(AddTrainingComponent, {
      width: '400px',
      data: { date: date },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.trainings.update((r) => [result]);
        this.trainings()?.sort((a, b) => a.date.getTime() - b.date.getTime());
        // Angular's change detection will automatically re-render the calendar
        // because the 'trainings' array, which 'dateClass' depends on, has changed.
      } else {
        console.log('Dialog closed without adding training.');
      }
    });
  }

  onPageChange(ev: any) {
    if (this.pageNumber !== ev.pageIndex + 1 || this.pageSize !== ev.pageSize) {
      this.pageNumber = ev.pageIndex + 1;
      this.pageSize = ev.pageSize;
      this.getTrainings();
    }
  }

  /**
   * Gets trainings for the currently selected date.
   * Used to display details below the calendar.
   */
  getTrainingsForSelectedDate(): Training[] | null {
    return null;
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

  applyFilters() {
    this.getTrainings();
  }

  resetFilters() {
    this.selectedStatus = null;
    this.selectedType.set(null);
    this.searchTerm.set('');

    this.applyFilters();
  }

  searchBySearchTerm(ev: any) {
    this.searchTerm.set(ev);

    if (this.searchTerm().length >= 3 || this.searchTerm().length == 0) {
      this.getTrainings();
    }
  }

  getFilteredMembers() {
    const training = this.selectedTraining();
    if (!training || !training.memberTrainings) return [];

    const term = this.searchTermCalendar.toLowerCase().trim();
    if (!term) return training.memberTrainings;

    return training.memberTrainings.filter((m) => {
      const fullName = (
        m.member.firstName +
        ' ' +
        m.member.lastName
      ).toLowerCase();
      return fullName.includes(term);
    });
  }
}
