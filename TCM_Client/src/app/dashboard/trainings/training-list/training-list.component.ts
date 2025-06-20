import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDatepickerModule,
  MatCalendarCellClassFunction,
} from '@angular/material/datepicker'; // Import MatCalendarCellClassFunction
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { AddTrainingComponent } from '../add-training/add-training.component';
import { MatTabsModule } from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import { Training } from '../../../_models/Training';

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
    MatExpansionModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './training-list.component.html',
  styleUrls: ['./training-list.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TrainingListComponent implements OnInit {
  trainings: Training[] = [];
  selectedDate: Date | null = null;
  

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    // Load dummy training data. In a real app, you'd fetch this from a service.
    this.trainings = [
      
    ];
    // Set a default selected date, e.g., today
    this.selectedDate = new Date();
  }

  /**
   * Custom function to apply CSS classes to calendar dates.
   * This is how you highlight training days.
   */
  dateClass: MatCalendarCellClassFunction<Date> = (
    date: Date,
    view: 'month' | 'year' | 'multi-year'
  ) => {
    // Only apply custom classes for the 'month' view
    if (view === 'month') {
      const hasTraining = this.trainings.some(
        (training) => training.date.toDateString() === date.toDateString()
      );
      return hasTraining ? 'has-training' : '';
    }
    return ''; // No custom class for 'year' or 'multi-year' views
  };

  /**
   * Handles date selection on the calendar.
   */
  onDateSelected(date: Date | null): void {
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
        this.trainings.push(result);
        this.trainings.sort((a, b) => a.date.getTime() - b.date.getTime());
        console.log('Training added:', result);
        // Angular's change detection will automatically re-render the calendar
        // because the 'trainings' array, which 'dateClass' depends on, has changed.
      } else {
        console.log('Dialog closed without adding training.');
      }
    });
  }

  /**
   * Gets trainings for the currently selected date.
   * Used to display details below the calendar.
   */
  getTrainingsForSelectedDate(): Training[] {
    if (!this.selectedDate) {
      return [];
    }
    return this.trainings.filter(
      (training) =>
        training.date.toDateString() === this.selectedDate!.toDateString()
    );
  }
}
