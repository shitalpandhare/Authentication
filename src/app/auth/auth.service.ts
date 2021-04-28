import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
  constructor(private http: HttpClient) {}

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
          this.accessToken = res.data.accessToken;
          this.userRole = res.data.role;
          const expiresIn = res.data.expiresIn;

          const currDate = new Date();
          const expirationDate = new Date(
            currDate.getTime() + expiresIn * 1000
          );
          this.saveAuthData(this.accessToken, expirationDate);
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
