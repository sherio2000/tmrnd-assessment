// auth.service.ts
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private cookieService: CookieService, private tokenService: TokenService) {}

  isLoggedIn(): boolean {
    const token = this.tokenService.getToken();
    if (token) {
      return true;
    } else {
      return false;
    }
  }
}
