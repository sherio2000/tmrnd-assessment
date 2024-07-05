import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { response } from 'express';
import { TokenService } from '../token.service';
import { AuthService } from '../auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, FormsModule, CommonModule, MatProgressSpinnerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  errorMessage: string = '';
  loading: boolean = true;

  constructor(private http: HttpClient, private router: Router, private tokenService: TokenService, private authService: AuthService) {}
  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      if(this.tokenService.isValidToken()) {
          this.loading = false
      } else {
        this.loading = false
      }

  } else {
    this.loading =  false;
  }
  }
  onSubmit(form: NgForm) {
    if (form.valid) {
      this.http.post<any>('https://intermediate-test-v-2-web-test.apps.ocp.tmrnd.com.my/api/auth', form.value)

        .subscribe(response => {
          console.log(response);
          if (response.success) {
            const tokenExpiryDate = new Date();
            tokenExpiryDate.setHours(tokenExpiryDate.getHours() + 1);
            this.tokenService.setToken(response.token, tokenExpiryDate.toISOString());
            this.router.navigate(['/home']);
          } else {
            alert('Login failed');
          }
        }, error => {
          this.errorMessage = 'Error: ' + error.message;
        });
    }
  }
}
