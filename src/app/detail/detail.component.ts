import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [
    MatTableModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, 
    MatIconModule, FormsModule, MatDatepickerModule, MatNativeDateModule, 
    MatProgressSpinnerModule, CommonModule
  ],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'id', 'title', 'status', 'remark', 'dateTimeString',
    'durationString', 'address'
  ];
  dataSource = new MatTableDataSource<any>([]);
  total: number = 0;
  pageSize: number = 5;
  pageIndex: number = 0;  // Track the current page index
  startDate: Date = new Date(new Date().setDate(new Date().getDate() - 1));
  endDate: Date = new Date();
  token: string | null = localStorage.getItem('token');
  loading: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private route: ActivatedRoute, private http: HttpClient, private toastr: ToastrService) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.fetchData(id, this.pageIndex, this.pageSize);
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  // Fetch data from server
  fetchData(id: string, pageIndex: number, pageSize: number) {
    this.loading = true;
    const token = this.getToken();
    const start = this.startDate.toISOString().split('T')[0];
    const end = this.endDate.toISOString().split('T')[0];

    this.http.get<any>(`https://intermediate-test-v-2-web-test.apps.ocp.tmrnd.com.my/api/data/alert/list/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        indexNumber: pageIndex.toString(),
        pageSize: pageSize.toString(),
        startDate: start,
        endDate: end
      }
    }).subscribe(response => {
      console.log(response);
      this.dataSource.data = response.data;
      this.total = response.total;
      if (this.paginator) {
        this.paginator.length = response.total; // Ensure paginator is defined before setting length
      }
      this.loading = false;
    }, error => {
      console.error('Error fetching alert list', error);
      this.toastr.error('Error fetching data', 'Error', { timeOut: 3000 });
      this.loading = false;
    });
  }

  // Get token
  getToken() {
    return localStorage.getItem('token');
  }

  // Pagination
  pageEvent(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchData(id, event.pageIndex, event.pageSize);
    }
  }

  // Update date range
  updateDateRange() {
    console.log(this.startDate, this.endDate);

    const validStartDate = new Date('2022-01-25');
    const validEndDate = new Date('2022-02-16');

    if (
      this.startDate < validStartDate ||
      this.startDate > validEndDate ||
      this.endDate < validStartDate ||
      this.endDate > validEndDate
    ) {
      this.toastr.info('Please select dates between 25th January 2022 and 16th February 2022.', 'Info', { timeOut: 3000 });
    }

    // Fetch data from server
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.pageIndex = 0;  // Reset to first page on date range change
      this.fetchData(id, this.pageIndex, this.pageSize);
    }
  }
}
