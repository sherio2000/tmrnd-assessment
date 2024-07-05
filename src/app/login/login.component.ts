import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { TokenService } from '../auth/token.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  errorMessage: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    if (this.tokenService.isValidToken()) {
      this.router.navigate(['/home']);
    }
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.http.post<any>('https://intermediate-test-v-2-web-test.apps.ocp.tmrnd.com.my/api/auth', form.value)
        .subscribe(response => {
          if (response.success) {
            const tokenExpiryDate = new Date();
            tokenExpiryDate.setHours(tokenExpiryDate.getHours() + 1);
            this.tokenService.setToken(response.token, tokenExpiryDate.toISOString());
            this.router.navigate(['/home']);
          } else {
            this.snackBar.open('Login failed', 'Close', { duration: 3000 });
          }
        }, error => {
          this.snackBar.open('Error: ' + error.message, 'Close', { duration: 3000 });
        });
    }
  }
}
