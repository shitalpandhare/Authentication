import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  role = '';
  isAuth = false;
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    this.authService.isAuthenticated.subscribe((res) => {
      this.isAuth = res;
    });

    if (this.isAuth) {
      this.role = localStorage.getItem('role');
      if (this.role == 'admin' || this.role == 'super') {
        return true;
      } else if (!this.role) {
        this.router.navigate(['/auth/login']);
      } else {
        this.router.navigate([this.role]);
      }
    } else {
      this.router.navigate(['/auth/login']);
    }
  }
}
