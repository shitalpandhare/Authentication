import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor(private authService: AuthService) {}

  isLoggedIn = false;
  ngOnInit(): void {
    this.authService.isAuthenticated.subscribe((res) => {
      this.isLoggedIn = res;
    });
  }

  onLogout() {
    console.log('in logout');
    this.authService.logout();
  }
}
