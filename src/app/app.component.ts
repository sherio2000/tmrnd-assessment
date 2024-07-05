import { Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { AppRoutingModule } from './app.routes';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { LoadingService } from './loading.service';

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
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'tmrnd-assessment';
  loading$ = this.loadingService.loading$;

  constructor(private loadingService: LoadingService) {}
}
