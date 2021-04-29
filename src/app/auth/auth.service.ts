import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
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
}
