import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, map, distinctUntilChanged } from 'rxjs/operators';

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

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('f') form: NgForm;
  users: User[] = [];

  searchText = '';
  updatedSearchText = new Subject<string>();

  totalAdmins = 0;
  adminPerPage = 3;
  pageSizeOptions = [3, 5, 10, 15];
  currentPage = 1;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    console.log('in on init');

    this.authService.adminCount.subscribe((res) => {
      this.totalAdmins = res;
      console.log('tottal admin', res);
    });
    this.authService.getAllUsers(this.adminPerPage, this.currentPage, 'admin');

    this.authService.updatedUsers.subscribe((users) => {
      this.users = users;
      this.dataSource = new MatTableDataSource(this.users);
      // this.dataSource.paginator = this.paginator;
      this.authService.isUpdateModeObservable.next(false);
    });

    this.updatedSearchText
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((searchText) => {
        if (searchText == '') {
          this.authService.getAllUsers(
            this.adminPerPage,
            this.currentPage,
            'admin'
          );
        } else {
          this.authService.searchAdmins(searchText);
        }
      });
  }

  // ngAfterViewInit() {
  //   console.log('in After veiw');
  //   this.dataSource.sort = this.sort;
  // }

  applyFilter(filterValue: string) {
    this.updatedSearchText.next(filterValue);
  }
  applySort(sort: MatSort) {
    console.log(sort);
    this.authService.sortAdmins(sort.active, sort.direction);
  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.adminPerPage = pageData.pageSize;
    this.authService.getAllUsers(this.adminPerPage, this.currentPage, 'admin');
  }
}
