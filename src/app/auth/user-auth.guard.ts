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
export class UserAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  role = '';
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    this.role = this.authService.getUserRole();
    if (this.role == 'super' || this.role == 'admin' || this.role == 'user') {
      return true;
    } else if (!this.role) {
      this.router.navigate(['/auth/login']);
    } else {
      this.router.navigate([this.role]);
    }
  }
}
