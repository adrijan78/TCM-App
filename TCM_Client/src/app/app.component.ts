import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  http = inject(HttpClient);
  title = 'TCM_Client';
  members: any;

  ngOnInit(): void {
    this.http.get('https://localhost:7292/api/members').subscribe({
      next: (res) => {
        this.members = res;
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('Request completed');
      },
    });
  }
}
