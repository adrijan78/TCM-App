import { Component, Input, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-countdown-timer',
  imports: [MatCardModule],
  templateUrl: './countdown-timer.component.html',
  styleUrl: './countdown-timer.component.css',
})
export class CountdownTimerComponent {
  @Input() targetDate: any;
  // Example target date
  days: number = 0;
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  private countdownSubscription: Subscription | undefined;

  ngOnInit() {
    console.log('Target Date:', this.targetDate);
    this.calculateTimeRemaining();
    this.startCountdown();
  }

  ngOnDestroy() {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }

  startCountdown() {
    this.countdownSubscription = interval(20000).subscribe(() => {
      this.calculateTimeRemaining();
    });
  }

  calculateTimeRemaining() {
    const now = new Date().getTime();
    if (!this.targetDate) return;
    const distance = new Date(this.targetDate).getTime() - now;

    if (distance < 0) {
      this.days = 0;
      this.hours = 0;
      this.minutes = 0;
      this.seconds = 0;
      if (this.countdownSubscription) {
        this.countdownSubscription.unsubscribe();
      }
      return;
    }

    this.days = Math.floor(distance / (1000 * 60 * 60 * 24));
    this.hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    this.seconds = Math.floor((distance % (1000 * 60)) / 1000);
  }
}
