import { Component, OnInit } from '@angular/core';
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


@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, MatIconModule, FormsModule, MatDatepickerModule, MatNativeDateModule, MatProgressSpinnerModule, CommonModule],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit{
  displayedColumns: string[] = [
    'id', 'title', 'status', 'remark', 'dateTimeString', 
    'durationString', 'address'
  ];
  dataSource = new MatTableDataSource<any>([]);
  total: number = 0;
  pageSize: number = 5;
  startDate: Date = new Date(new Date().setDate(new Date().getDate() - 1));
  endDate: Date = new Date();
  token: string | null = localStorage.getItem('token');
  loading: boolean = false;

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.fetchData(id,  0, this.pageSize);
      }
    });
  }


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
      this.loading = false;
    }, error => {
      console.error('Error fetching alert list', error);
      this.loading = false;
    });
  }


  getToken() {
    return localStorage.getItem('token');
  }

  pageEvent(event: PageEvent) {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.fetchData(id, event.pageIndex, event.pageSize);
      }
    });
  }

  updateDateRange() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.fetchData(id, 0, this.pageSize);
      }
    });
  }
}
