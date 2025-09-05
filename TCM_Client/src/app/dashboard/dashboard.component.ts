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
import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AcountService } from '../_services/account/acount.service';
import { LoginComponent } from '../login/login.component';
import { LoginMember } from '../_models/Member';

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
  @ViewChild('sidenav') sidenav!: MatSidenav;
  public accountService = inject(AcountService);
  private router = inject(Router);
  title = 'TCM_Client';
  loggedMember = signal<LoginMember | null>(null);

  ngOnInit(): void {
    this.loggedMember.set(this.accountService.currentUser());
  }

  logout() {
    this.accountService.logout();
  }

  closeSidenav() {
    this.sidenav.close();
  }
}
