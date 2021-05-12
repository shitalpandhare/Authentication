import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { User } from './user.model';

import jwt_decode from 'jwt-decode';

export interface AuthResponse {
  info: {
    status: string;
    code: string;
  };
  data: {
    responseMsg: string;
    email: string;
    userId: string;
    role: string;
    accessToken: string;
    expiresIn: number;
  };
  error: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit {
  private accessToken: string;
  private userRole: string;

  adminResponse: any;
  users: User[] = [];
  updatedUsers = new BehaviorSubject<User[]>(this.users);

  isUpdateMode = false;
  isUpdateModeObservable = new Subject<boolean>();
  private tokenTimer: any;
  isAuthenticated = new BehaviorSubject<boolean>(false);

  adminCount = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient, private router: Router) {}
  ngOnInit(): void {
    this.isUpdateModeObservable.subscribe((res) => {
      this.isUpdateMode = res;
    });
  }

  getAccessToken() {
    return this.accessToken;
  }

  getUserRole() {
    return this.userRole;
  }

  // signup

  signup(obj: User) {
    console.log(' in signup');
    console.log(obj);

    return this.http
      .post<AuthResponse>('http://localhost:3000/api/user/signup', obj)
      .subscribe(
        (res) => {
          if (this.isUpdateMode) {
            this.router.navigate(['/super/admin-list']);
          } else {
            this.router.navigate(['/auth/login']);
          }

          console.log(res);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  // login

  login(email: string, password: string) {
    return this.http
      .post<AuthResponse>('http://localhost:3000/api/user/login', {
        email: email,
        password: password,
      })
      .subscribe(
        (res) => {
          console.log(res);
          this.accessToken = res.data.accessToken;
          if (this.accessToken) {
            this.userRole = res.data.role;

            const expiresIn = res.data.expiresIn;
            this.setAuthTimer(expiresIn);

            this.isAuthenticated.next(true);

            const currDate = new Date();
            const expirationDate = new Date(
              currDate.getTime() + expiresIn * 1000
            );
            this.saveAuthData(this.accessToken, expirationDate, this.userRole);

            let dec: {
              email: string;
              userId: string;
              exp: number;
              iat: number;
            } = jwt_decode(this.accessToken);
            var date = new Date(currDate.getTime() + dec.exp / 1000);

            console.log(dec);
            console.log(date);

            if (this.userRole == 'super') {
              this.router.navigate(['/super']);
            } else if (this.userRole == 'admin') {
              this.router.navigate(['/admin']);
            } else if (this.userRole == 'user') {
              this.router.navigate(['/user']);
            }
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.accessToken = authInformation.token;
      this.isAuthenticated.next(true);
      this.setAuthTimer(expiresIn / 1000);
    }
  }

  logout() {
    this.accessToken = null;
    this.clearAuthData();
    clearTimeout(this.tokenTimer);
    this.isAuthenticated.next(false);
    this.router.navigate(['/auth/login']);
  }

  private saveAuthData(token: string, expirationDate: Date, role: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('role', role);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('role');
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
    };
  }

  //fetch All user

  async getAllUsers(postPerPage: number, currentPage: number, role: string) {
    try {
      let queryParams = `?pageSize=${postPerPage}&page=${currentPage}`;
      let res = await this.http
        .get<{ message: string; users: User[]; maxAdmins: number }>(
          'http://localhost:3000/api/user/' + role + queryParams
        )
        .toPromise();

      if (res) {
        console.log('getUser');
        this.users = res.users;
        this.updatedUsers.next(this.users);
        console.log(res);
        this.adminCount.next(res.maxAdmins);
      }
    } catch (err) {
      console.log(err);
    }
  }

  getAdminById(id: string) {
    return this.http.get<{ message: string; admin: User }>(
      'http://localhost:3000/api/user/admin/' + id
    );
  }

  updateAdmin(obj: User, id: string) {
    return this.http
      .put<AuthResponse>('http://localhost:3000/api/user/admin/' + id, obj)
      .subscribe(
        (res) => {
          this.router.navigate(['/super/admin-list']);
          console.log(res);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  async searchAdmins(searchText: string) {
    try {
      let res = await this.http
        .get<{ message: string; users: User[] }>(
          'http://localhost:3000/api/user/admin/search/' + searchText
        )
        .toPromise();

      if (res) {
        this.users = res.users;
        this.updatedUsers.next(this.users);
      } else {
        this.users = [];
        this.updatedUsers.next(this.users);
      }
    } catch (err) {
      console.log('in catch');

      console.log(err);
    }
  }

  async sortAdmins(active: string, direction: string) {
    try {
      let res = await this.http
        .post<{ message: string; users: User[] }>(
          'http://localhost:3000/api/user/admin/sort',
          { active: active, direction: direction }
        )
        .toPromise();

      if (res) {
        console.log('in sort');
        this.users = res.users;
        this.updatedUsers.next(this.users);
      }
    } catch (err) {
      console.log(err);
    }
  }
}
