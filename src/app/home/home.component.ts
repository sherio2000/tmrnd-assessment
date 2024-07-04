import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ProductModalComponent } from '../product-modal/product-modal.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, FormsModule, MatTableModule, MatIconModule, MatPaginatorModule, MatProgressSpinnerModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  displayedColumns: string[] = ['productName', 'url', 'actions'];
  products: any[] = [];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  token: string | null = localStorage.getItem('token');
  loading: boolean = false;

  constructor(private http: HttpClient, public dialog: MatDialog, private router: Router) {}


  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    this.loading = true;
    const token = this.getToken();
    this.http.get<any[]>('https://intermediate-test-v-2-web-test.apps.ocp.tmrnd.com.my/api/data/productList', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe(data => {
      console.log(data);
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.loading = false;
    }, error => {
      console.error('Error fetching product list', error);
      this.loading = false;
    });
  }


  getToken() {
    return localStorage.getItem('token');
  }
  
  addProduct() {
    const dialogRef = this.dialog.open(ProductModalComponent, {
      width: '250px',
      data: null
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        if (result.action === 'add') {
          const updatedData = [...this.dataSource.data, result.product];
          this.dataSource.data = updatedData;
        } else if (result.action === 'edit') {
          const index = this.products.findIndex(p => p.id === result.product.id);
          this.products[index] = result.product;
        } else if (result.action === 'remove') {
          this.products = this.products.filter(p => p.id !== result.product.id);
        }
      }
    });
  }
  
  editProduct(product: any) {
    const dialogRef = this.dialog.open(ProductModalComponent, {
      width: '250px',
      data: product
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.action === 'edit') {
          const index = this.products.findIndex(p => p.id === result.product.id);
          this.products[index] = result.product;
        } else if (result.action === 'remove') {
          this.products = this.products.filter(p => p.id !== result.product.id);
        }
      }
    });
  }

    removeProduct(id: string) {
    // Your logic to remove a product
    console.log('Remove product logic here', id);
    this.products = this.products.filter(product => product.id !== id);
  }

  goToDetails(productId: string) {
    this.router.navigate(['/detail', productId]);
  }

}
