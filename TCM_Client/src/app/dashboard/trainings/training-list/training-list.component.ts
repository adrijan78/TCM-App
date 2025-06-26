import { Component, inject, OnInit, signal, ViewEncapsulation } from '@angular/core';
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
import { MatPaginatorModule } from '@angular/material/paginator';
import { TrainingService } from '../../../_services/training/training.service';
import { TrainingStatus } from '../../../_models/_enums/TrainingStatus';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, NgModel } from '@angular/forms';
import { Pagination } from '../../../_models/Pagination';


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
    
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './training-list.component.html',
  styleUrls: ['./training-list.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TrainingListComponent implements OnInit {
  trainingService=inject(TrainingService);
  activeTraining=TrainingStatus.Active
  canceledTraining = TrainingStatus.Canceled
  finishedTraining = TrainingStatus.Finished


  trainings= signal<Training[]|null>(null);
  selectedDate: Date | null = null;
  totalTrainings = 0;
  pageSize = 5; 
  pageNumber=1;
  pageSizeOptions = [5, 10, 20, 50];
  selectedStatus=signal<number|null>(null);
  selectedType=signal<number|null>(null);
  searchTerm=signal<string>('');
  

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.selectedDate = new Date();
    this.getTrainings();
  }

  getTrainings(){
    this.trainingService.getTrainingsByMoths(this.pageNumber,
      this.pageSize,
      this.selectedStatus(),
      this.selectedType(),
      this.searchTerm()).subscribe({
      next:(res)=>{
        let response = res.body as Training[]|null;
        this.trainings.set(response);
        let pagination: Pagination = JSON.parse(res.headers.get('Pagination')!)
                this.pageNumber=pagination.currentPage!;
                this.pageSize = pagination.itemsPerPage!;
                this.totalTrainings=pagination.totalItems!;
        this.getTrainingsForSelectedDate()

      }
    })
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
      for (let training of this.trainings()!) {

        if(new Date(training.date).toDateString() == date.toDateString()){
          hasTraining=true;
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
        this.trainings.update(r=>[result]);
        this.trainings()?.sort((a, b) => a.date.getTime() - b.date.getTime());
        // Angular's change detection will automatically re-render the calendar
        // because the 'trainings' array, which 'dateClass' depends on, has changed.
      } else {
        console.log('Dialog closed without adding training.');
      }
    });
  }
  onPageChange(ev:any){
    if(this.pageNumber !== ev.pageIndex+1 ||this.pageSize!==ev.pageSize){
      this.pageNumber=ev.pageIndex+1;
      this.pageSize=ev.pageSize;
      this.getTrainings();
    }
  }

  /**
   * Gets trainings for the currently selected date.
   * Used to display details below the calendar.
   */
getTrainingsForSelectedDate(): Training[] | null {
  if (!this.selectedDate) {
    return null; // Return null if no date is selected
  }

  const currentTrainings = this.trainings(); // Get the current value of the signal

  if (!currentTrainings) {
    return null; // Return null if no current trainings are available
  }

  const filtered = currentTrainings.filter(training =>{

    new Date(training.date).toDateString() === new Date(this.selectedDate!).toDateString()
  }
  );

  return filtered.length > 0 ? filtered : null;
}



  applyFilters(){
    this.getTrainings();
  }

  resetFilters(){
    this.selectedStatus.set(null);
    this.selectedType.set(null);
    this.searchTerm.set('');

    this.applyFilters();
  }
  
  searchBySearchTerm(ev:any){
    this.searchTerm.set(ev)

    if(this.searchTerm().length>=3 || this.searchTerm().length==0){
      this.getTrainings();
    }

  }
}
