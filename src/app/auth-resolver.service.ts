import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthResolver implements Resolve<boolean> {
  constructor(private authService: AuthService, private router: Router, private tokenService: TokenService) {}

  resolve(): boolean {
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
