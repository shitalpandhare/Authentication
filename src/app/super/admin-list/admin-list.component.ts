import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.component.html',
  styleUrls: ['./admin-list.component.css'],
})
export class AdminListComponent implements OnInit {
  faEdit = faEdit;
  filter = faFilter;
  searchProduct: String = '';

  displayedColumns = [
    'firstname',
    'lastname',
    'email',
    'address',
    'role',
    'gender',
    'Action',
  ];

  dataSource: MatTableDataSource<User>;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('f') form: NgForm;
  users: User[] = [];

  searchText = '';
  updatedSearchText = new Subject<string>();

  totalAdmins = 0;
  adminPerPage = 3;
  pageSizeOptions = [3, 5, 10, 15];
  currentPage = 1;
  isLoadingResults = true;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getAllUsers(this.adminPerPage, this.currentPage, 'admin');

    this.authService.adminCount.subscribe((res) => {
      this.totalAdmins = res;
    });

    this.authService.updatedUsers.subscribe((users) => {
      this.isLoadingResults = false;
      this.users = users;
      this.dataSource = new MatTableDataSource(this.users);
      this.authService.isUpdateModeObservable.next(false);
    });

    this.updatedSearchText
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((searchText) => {
        this.searchText = searchText;
        this.isLoadingResults = true;
        if (searchText == '') {
          this.searchText = '';
          this.paginator.pageIndex = 0;
          this.currentPage = 1;
          this.adminPerPage = this.paginator.pageSize;
          this.authService.getAllUsers(
            this.adminPerPage,
            this.currentPage,
            'admin'
          );
        } else {
          this.paginator.pageIndex = 0;

          if (this.sort.active == undefined) {
            this.authService.searchAdmins(
              searchText,
              this.paginator.pageIndex + 1,
              this.paginator.pageSize
            );
          } else {
            this.authService.searchSortAdmins(
              this.searchText,
              this.sort.active,
              this.sort.direction,
              this.paginator.pageIndex + 1,
              this.paginator.pageSize
            );
          }
        }
      });
  }

  applyFilter(filterValue: string) {
    this.updatedSearchText.next(filterValue);
  }

  ngAfterViewInit() {
    //

    this.sort.sortChange.subscribe(() => {
      this.isLoadingResults = true;
      this.paginator.pageIndex = 0;

      if (this.searchText == '') {
        this.authService.sortAdmins(
          this.sort.active,
          this.sort.direction,
          this.paginator.pageIndex + 1,
          this.paginator.pageSize
        );
      } else {
        this.authService.searchSortAdmins(
          this.searchText,
          this.sort.active,
          this.sort.direction,
          this.paginator.pageIndex + 1,
          this.paginator.pageSize
        );
      }
    });

    this.paginator.page.subscribe(() => {
      this.isLoadingResults = true;
      this.currentPage = this.paginator.pageIndex + 1;
      this.adminPerPage = this.paginator.pageSize;

      if (this.sort.active == undefined && this.searchText == '') {
        this.authService.getAllUsers(
          this.adminPerPage,
          this.currentPage,
          'admin'
        );
      } else if (this.sort.active != undefined && this.searchText == '') {
        this.authService.sortAdmins(
          this.sort.active,
          this.sort.direction,
          this.paginator.pageIndex + 1,
          this.paginator.pageSize
        );
      } else if (this.searchText != '' && this.sort.active == undefined) {
        this.authService.searchAdmins(
          this.searchText,
          this.paginator.pageIndex + 1,
          this.paginator.pageSize
        );
      } else if (this.searchText != '' && this.sort.active != undefined) {
        this.authService.searchSortAdmins(
          this.searchText,
          this.sort.active,
          this.sort.direction,
          this.paginator.pageIndex + 1,
          this.paginator.pageSize
        );
      }
    });
  }
}
