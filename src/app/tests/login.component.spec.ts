import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { of, throwError } from 'rxjs';
import { LoginComponent } from '../login/login.component';
import { AuthService } from '../auth/auth.service';
import { TokenService } from '../auth/token.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let tokenService: TokenService;
  let httpMock: HttpTestingController;
  let toastr: ToastrService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatProgressSpinnerModule,
        ToastrModule.forRoot(), // Add ToastrModule here
      ],
      providers: [AuthService, TokenService, ToastrService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    tokenService = TestBed.inject(TokenService);
    httpMock = TestBed.inject(HttpTestingController);
    toastr = TestBed.inject(ToastrService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should login successfully with valid credentials', () => {
    spyOn(authService, 'isLoggedIn').and.returnValue(false);
    spyOn(tokenService, 'setToken');
    spyOn(component['http'], 'post').and.returnValue(of({ success: true, token: 'dummy-token' }));

    component.onSubmit({ valid: true, value: { username: 'test', password: 'test' } } as any);

    expect(component['http'].post).toHaveBeenCalled();
    expect(tokenService.setToken).toHaveBeenCalledWith('dummy-token', jasmine.any(String));
    expect(component.errorMessage).toBe('');
  });

  it('should show a toastr message on login failure', () => {
    const toastrSpy = spyOn(toastr, 'error').and.callThrough();
    const form = fixture.debugElement.query(By.css('form'));
    const usernameInput = form.query(By.css('input[name="username"]')).nativeElement;
    const passwordInput = form.query(By.css('input[name="password"]')).nativeElement;
    const loginButton = form.query(By.css('button[type="submit"]')).nativeElement;

    usernameInput.value = 't';
    passwordInput.value = 't';
    usernameInput.dispatchEvent(new Event('input'));
    passwordInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    loginButton.click();

    const req = httpMock.expectOne('https://intermediate-test-v-2-web-test.apps.ocp.tmrnd.com.my/api/auth');
    req.flush('Login failed', { status: 401, statusText: 'Unauthorized' });

    fixture.detectChanges();

    expect(toastrSpy).toHaveBeenCalledWith('Login failed', 'Error', { timeOut: 3000 });
  });

  it('should handle http error on login attempt', () => {
    spyOn(component['http'], 'post').and.returnValue(throwError({ message: 'Network Error' }));
    const toastrSpy = spyOn(toastr, 'error').and.callThrough();

    component.onSubmit({ valid: true, value: { username: 'test', password: 'test' } } as any);

    expect(component.errorMessage).toBe('');
    expect(toastrSpy).toHaveBeenCalledWith('Login failed', 'Error', { timeOut: 3000 });
  });

  it('should login successfully with valid credentials', () => {
    spyOn(authService, 'isLoggedIn').and.returnValue(false);
    spyOn(tokenService, 'setToken');
    spyOn(component['http'], 'post').and.returnValue(of({ success: true, token: 'dummy-token' }));

    component.onSubmit({ valid: true, value: { username: 'test', password: 'test' } } as any);

    expect(component['http'].post).toHaveBeenCalled();
    expect(tokenService.setToken).toHaveBeenCalledWith('dummy-token', jasmine.any(String));
    expect(component.errorMessage).toBe('');
  });
});
