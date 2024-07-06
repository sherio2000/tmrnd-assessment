import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { LoadingService } from './loading.service';
import { TokenService } from './auth/token.service';
import { ToastrModule } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'tmrnd-assessment';
  loading$ = this.loadingService.loading$;
  showLogoutButton = true;

  constructor(private loadingService: LoadingService, private router: Router, private tokenService: TokenService) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showLogoutButton = !this.router.url.includes('login');
      }
    });
  }

  logout() {
    this.tokenService.clearToken();
    this.router.navigate(['/login']);
  }
}
