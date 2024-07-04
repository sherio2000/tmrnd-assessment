// auth.guard.ts
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private tokenService: TokenService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isLoggedIn()) {
        if(this.tokenService.isValidToken()) {
            return true;
        } else {
            this.router.navigate(['/login']);
            return false;
        }

    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
