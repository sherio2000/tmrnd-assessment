import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  imports: [
    MatInputModule, 
    MatFormFieldModule, 
    FormsModule, 
    MatTableModule, 
    MatIconModule, 
    MatPaginatorModule, 
    MatProgressSpinnerModule, 
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  displayedColumns: string[] = ['productName', 'url', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  loading: boolean = false;

  constructor(private http: HttpClient, public dialog: MatDialog, private snackBar: MatSnackBar, private router: Router) {}

  ngOnInit() {
    this.loadProductsFromStorage();
    this.dataSource.paginator = this.paginator;
  }

  fetchProducts() {
    this.loading = true;
    const token = this.getToken();
    this.http.get<any[]>('https://intermediate-test-v-2-web-test.apps.ocp.tmrnd.com.my/api/data/productList', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe(data => {
      console.log(data);
      this.dataSource.data = data;
      this.saveProductsToStorage(data);
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
      if (result) {
        console.log(result.product.productName)
        if (!result.product.productName || !result.product.url) {

          this.snackBar.open('All fields must be populated', 'Close', { duration: 3000 });
        }else {

          const updatedData = [...this.dataSource.data, result.product];
          this.dataSource.data = updatedData;
          this.saveProductsToStorage(updatedData);
          this.snackBar.open('Product added successfully', 'Close', { duration: 3000 });
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
        const updatedData = this.dataSource.data.map(item => {
          if (item.id === result.product.id) {
            return {
              ...item,
              productName: result.product.productName || item.productName,
              url: result.product.url || item.url
            };
          }
          return item;
        });
        this.dataSource.data = updatedData;
        this.saveProductsToStorage(updatedData);
        this.snackBar.open('Product edited successfully', 'Close', { duration: 3000 });
      }
    });
  }

  removeProduct(id: string) {
    const updatedData = this.dataSource.data.filter(product => product.id !== id);
    this.dataSource.data = updatedData;
    this.saveProductsToStorage(updatedData);
    this.snackBar.open('Product removed successfully', 'Close', { duration: 3000 });
  }

  goToDetails(productId: string) {
    this.router.navigate(['/detail', productId]);
  }

  private saveProductsToStorage(products: any[]) {
    localStorage.setItem('products', JSON.stringify(products));
  }

  private loadProductsFromStorage() {
    const products = localStorage.getItem('products');
    if (products) {
      this.dataSource.data = JSON.parse(products);
    } else {
      this.fetchProducts();  // Fetch from server if no data in localStorage
    }
  }
}
