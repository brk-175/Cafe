import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import jwt_decode from 'jwt-decode';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';
import { SnackbarService } from './services/snackbar.service';
import { GlobalConstants } from './shared/global-constants';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBarService: SnackbarService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    let roles = route.data;
    roles = roles.expectedRoles;
    const token: any = localStorage.getItem('token');
    let tokenPayload: any;
    let userRole: any;
    try {
      tokenPayload = jwt_decode(token);
    } catch (error) {
      localStorage.clear();
      this.router.navigate(['/']);
    }

    userRole = tokenPayload.role;
    for (let i = 0; i < roles.length; i++) {
      if (userRole == roles[i]) {
        if (this.authService.isAuthenticated()) return true;
      }
    }
    this.snackBarService.openSnackBar(GlobalConstants.unauthorized, 'error');
    return false;
  }
}
