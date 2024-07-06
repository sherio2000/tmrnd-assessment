import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
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
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ProductService } from './product.service';

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
    CommonModule,
    ToastrModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['productName', 'url', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  loading: boolean = false;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private toastr: ToastrService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.productService.products$.subscribe(products => {
      this.dataSource.data = products;
      this.dataSource.paginator = this.paginator;
      if (products.length === 0) {
        this.toastr.info('No products available. Refresh the page and make sure the table is empty', 'Info', { timeOut: 6000 });
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  fetchProducts() {
    this.loading = true;
    this.productService.fetchProducts();
    this.loading = false;
  }

  addProduct() {
    const dialogRef = this.dialog.open(ProductModalComponent, {
      width: '250px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (!result.product.productName || !result.product.url) {
          this.toastr.error('Please Fill All Fields', 'Sorry', { timeOut: 3000 });
        } else {
          this.productService.addProduct(result.product);
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
        this.productService.editProduct(result.product);
      }
    });
  }

  removeProduct(id: string) {
    this.productService.removeProduct(id);
  }

  goToDetails(productId: string) {
    this.router.navigate(['/detail', productId]);
  }
}
