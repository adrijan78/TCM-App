import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-card',
  imports: [MatCardModule,RouterModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  title= input<string>();
  image=input<string>();
  cardValue=input<any>();
  routePath=input<string>();
}
