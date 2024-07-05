import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private isBrowser: boolean;
  private tokenKey = 'token';
  private tokenExpiryKey = 'tokenExpiry';

  constructor(@Inject(PLATFORM_ID) platformId: object, private router: Router) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.startTokenValidator();
    }
  }

  setToken(token: string, expiry: string): void {
    if (this.isBrowser) {
      localStorage.setItem(this.tokenKey, token);
      localStorage.setItem(this.tokenExpiryKey, expiry);
    }
  }

  getToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  clearToken(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.tokenExpiryKey);
    }
  }

  startTokenValidator() {
    setInterval(() => {
        console.log('Checking token...');
      this.validateToken();
    }, 300000); // Check every 5 minutes
  }

  validateToken() {
    if (this.isBrowser) {
      const expiry = localStorage.getItem(this.tokenExpiryKey);
      if (expiry) {
        const expiryDate = new Date(expiry);
        if (new Date() > expiryDate) {
          console.log('Token expired');
          this.clearToken();
          this.router.navigate(['/login']);
        } else {
          console.log('Token Valid');
        }
      }
    }
  }

  isValidToken() : boolean {
    if (this.isBrowser) {
      const expiry = localStorage.getItem(this.tokenExpiryKey);
      if (expiry) {
        const expiryDate = new Date(expiry);
        if (new Date() > expiryDate) {
          console.log('Token expired');
          this.clearToken();
          this.router.navigate(['/login']);
          return false;
        } else {
          console.log('Token Valid');
          return true;
        }

      }
    } 
    return false;
  }
}
