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
import {
  Component,
  computed,
  inject,
  Input,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
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
import { DropDownMember, LoginMember, Member } from '../_models/Member';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SharedService } from '../_services/shared.service';

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
    MatInputModule,
    CommonModule,
    FormsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  members: DropDownMember[] = [];
  @ViewChild('sidenav') sidenav!: MatSidenav;
  public accountService = inject(AcountService);
  private sharedService = inject(SharedService);
  private router = inject(Router);
  title = 'TCM_Client';
  loggedMember = signal<LoginMember | null>(null);
  filteredMembers: any = [];

  searchTerm = signal('');
  // filteredMembers = computed(() =>
  //   this.members.filter((m) =>
  //     m.name.toLowerCase().includes(this.searchTerm().toLowerCase())
  //   )
  // );

  ngOnInit(): void {
    this.loggedMember.set(this.accountService.currentUser());
    this.sharedService.getClubMembersForDropdown().subscribe({
      next: (members: any) => {
        this.members = members;
        this.sharedService.clubMembers = members;
        this.filteredMembers = computed(() =>
          this.members.filter((m) =>
            m.name.toLowerCase().includes(this.searchTerm().toLowerCase())
          )
        );
      },
    });
  }

  getFilteredMembers() {
    const members = this.members;
    if (!members) return [];

    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return members;

    return members.filter((n) => {
      const title = n.name.toLowerCase();
      return title.includes(term);
    });
  }

  onSelect(member: DropDownMember) {
    this.searchTerm.set('');
    this.router.navigate([`/members/${member.id}/attendance-performance`]);
  }

  displayMember(member: DropDownMember): string {
    return member ? member.name : '';
  }

  logout() {
    this.accountService.logout();
  }

  closeSidenav() {
    this.sidenav.close();
  }
}
