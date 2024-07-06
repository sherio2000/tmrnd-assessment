import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { DetailComponent } from '../detail/detail.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DetailComponent, // Import DetailComponent since it is standalone
        HttpClientTestingModule,
        RouterTestingModule,
        BrowserAnimationsModule, // Import BrowserAnimationsModule
        ToastrModule.forRoot()
      ],
      providers: [
        {
          provide: ActivatedRoute,
          ToastrService,
          useValue: {
            paramMap: of({
              get: (key: string) => '123' // Mock the paramMap to return '123' for the 'id' parameter
            })
          }
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
