import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { response } from 'express';
import { TokenService } from '../token.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router, private tokenService: TokenService) {}
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
