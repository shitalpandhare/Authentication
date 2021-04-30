import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';

@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.component.html',
  styleUrls: ['./admin-list.component.css'],
})
export class AdminListComponent implements OnInit {
  users: User[] = [];

  dataSource: User[] = [];
  displayedColumns: string[] = [
    'firstname',
    'lastname',
    'email',
    'address',
    'role',
    'gender',
  ];
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getAllUsers('admin');
    this.authService.updatedUsers.subscribe((users) => {
      this.users = users;
      this.dataSource = this.users;
    });
  }
}
