import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsSubject = new BehaviorSubject<any[]>([]);
  products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient, private toastr: ToastrService) {
    this.loadProductsFromStorage();
  }

  // load products from local storage
  private loadProductsFromStorage() {
    const products = localStorage.getItem('products');
    if (products) {
      const parsedProducts = JSON.parse(products);
      if (parsedProducts.length > 0) {
        this.productsSubject.next(parsedProducts);
      } else {
        this.fetchProducts();
      }
    } else {
      this.fetchProducts();
    }
  }

  // save products to local storage
  saveProductsToStorage(products: any[]) {
    localStorage.setItem('products', JSON.stringify(products));
    this.productsSubject.next(products);
  }

  // fetch products from API
  fetchProducts() {
    this.http.get<any[]>('https://intermediate-test-v-2-web-test.apps.ocp.tmrnd.com.my/api/data/productList', {
      headers: { Authorization: `Bearer ${this.getToken()}` }
    }).subscribe(
      products => {
        this.saveProductsToStorage(products);
      },
      error => {
        this.toastr.error('Failed to fetch products', 'Error', { timeOut: 3000 });
      }
    );
  }

  private getToken() {
    return localStorage.getItem('token');
  }

  // CRUD operations for products
  removeProduct(id: string) {
    const currentProducts = this.productsSubject.getValue();
    const index = currentProducts.findIndex(product => product.id === id);
    if (index !== -1) {
      const updatedProducts = [...currentProducts];
      updatedProducts.splice(index, 1);
      this.saveProductsToStorage(updatedProducts);
      this.toastr.success('Product removed successfully', 'Success', { timeOut: 3000 });
    } else {
      this.toastr.error('Product not found', 'Error', { timeOut: 3000 });
    }
  }

  addProduct(product: any) {
    const currentProducts = this.productsSubject.getValue();
    const updatedProducts = [...currentProducts, product];
    this.saveProductsToStorage(updatedProducts);
    this.toastr.success('Product added successfully', 'Success', { timeOut: 3000 });
  }

  editProduct(updatedProduct: any) {
    const currentProducts = this.productsSubject.getValue();
    const updatedProducts = currentProducts.map(product => {
      if (product.id === updatedProduct.id) {
        return { ...product, ...updatedProduct };
      }
      return product;
    });
    this.saveProductsToStorage(updatedProducts);
    this.toastr.success('Product edited successfully', 'Success', { timeOut: 3000 });
  }
}
