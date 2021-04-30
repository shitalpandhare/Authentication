import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { User } from './user.model';

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
export class AuthService {
  private accessToken: string;
  private userRole: string;

  users: User[] = [];
  updatedUsers = new BehaviorSubject<User[]>(this.users);

  constructor(private http: HttpClient, private router: Router) {}

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
          this.router.navigate(['/auth/login']);
          console.log(res);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  // login

  login(email: string, password: string) {
    console.log(' in auth service ');

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
            const currDate = new Date();
            const expirationDate = new Date(
              currDate.getTime() + expiresIn * 1000
            );
            this.saveAuthData(this.accessToken, expirationDate);

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

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthDate() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  //fetch All user

  getAllUsers(role: string) {
    return this.http
      .get<{ message: string; users: User[] }>(
        'http://localhost:3000/api/user/' + role
      )
      .subscribe(
        (res) => {
          console.log('in getallUsers');
          console.log(res);
          this.users = res.users;
          this.updatedUsers.next(this.users);
        },
        (err) => {
          console.log(err);
        }
      );
  }
}
