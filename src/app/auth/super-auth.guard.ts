import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class SuperAuthGuard implements CanActivate {
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
    console.log('in canActivate');
    this.role = this.authService.getUserRole();
    if (this.role == 'super') {
      return true;
    } else if (!this.role) {
      this.router.navigate(['/auth/login']);
    } else {
      this.router.navigate([this.role]);
    }
  }
}
