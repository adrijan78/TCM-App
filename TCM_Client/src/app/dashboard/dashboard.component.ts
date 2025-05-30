// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-dashboard',
//   imports: [],
//   templateUrl: './dashboard.component.html',
//   styleUrl: './dashboard.component.css'
// })
// export class DashboardComponent {

// }
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AcountService } from '../_services/account/acount.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatSidenavModule, // Sidenav component
    MatListModule, // For list items in sidenav
    MatIconModule, // For material icons
    MatToolbarModule, // For the toolbar
    MatButtonModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  public accountService = inject(AcountService);
  private router = inject(Router);
  http = inject(HttpClient);
  title = 'TCM_Client';
  members: any;

  ngOnInit(): void {
    this.setCurrentUser();
    this.getMembers();
  }

  setCurrentUser() {
    const memberString = localStorage.getItem('member');
    if (!memberString) {
      this.router.navigate(['/login']);
    } else {
      this.accountService.currentUser.set(JSON.parse(memberString));
    }
  }

  getMembers() {
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

  logout() {
    this.accountService.logout();
  }
}
