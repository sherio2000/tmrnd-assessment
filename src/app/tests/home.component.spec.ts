import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from '../home/home.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BehaviorSubject, of } from 'rxjs';
import { ProductService } from '../home/product.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let dialog: MatDialog;
  let toastr: ToastrService;
  let productService: jasmine.SpyObj<ProductService>;
  let productsSubject: BehaviorSubject<any[]>;

  beforeEach(async () => {
    productsSubject = new BehaviorSubject<any[]>([]);

    const productServiceSpy = jasmine.createSpyObj('ProductService', ['fetchProducts', 'addProduct', 'editProduct', 'removeProduct'], {
      products$: productsSubject.asObservable()
    });

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatTableModule,
        MatPaginatorModule,
        MatDialogModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot() // Add ToastrModule.forRoot() here
      ],
      providers: [
        MatDialog,
        ToastrService,
        { provide: ProductService, useValue: productServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    dialog = TestBed.inject(MatDialog);
    toastr = TestBed.inject(ToastrService);
    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a product and show a toastr message', () => {
    const toastrSpy = spyOn(toastr, 'success').and.callThrough();
    spyOn(dialog, 'open').and.returnValue({
      afterClosed: () => of({ product: { id: '1', productName: 'New Product', url: 'https://example.com' } }) // Simulate adding a product
    } as any);

    productService.addProduct.and.callFake((product) => {
      const currentProducts = productsSubject.getValue();
      productsSubject.next([...currentProducts, product]);
      toastr.success('Product added successfully', 'Success', { timeOut: 3000 });
    });

    component.addProduct();
    fixture.detectChanges(); // Trigger change detection

    expect(productService.addProduct).toHaveBeenCalledWith(jasmine.objectContaining({ productName: 'New Product', url: 'https://example.com' }));
    expect(toastrSpy).toHaveBeenCalledWith('Product added successfully', 'Success', { timeOut: 3000 });
  });

  it('should show a toastr message when fields are missing', () => {
    const toastrSpy = spyOn(toastr, 'error').and.callThrough();
    spyOn(dialog, 'open').and.returnValue({
      afterClosed: () => of({ product: { productName: '', url: '' } }) // Simulate missing fields
    } as any);

    component.addProduct();
    fixture.detectChanges(); // Trigger change detection

    expect(toastrSpy).toHaveBeenCalledWith('Please Fill All Fields', 'Sorry', { timeOut: 3000 });
  });

  it('should edit a product and show a toastr message', () => {
    spyOn(dialog, 'open').and.returnValue({
      afterClosed: () => of({ product: { id: '1', productName: 'Edited Product', url: 'https://example.com' } })
    } as any);
    const toastrSpy = spyOn(toastr, 'success').and.callThrough();

    component.dataSource.data = [{ id: '1', productName: 'Old Product', url: 'https://example.com' }];
    productService.editProduct.and.callFake((product) => {
      const currentProducts = productsSubject.getValue();
      const updatedProducts = currentProducts.map(p => p.id === product.id ? product : p);
      productsSubject.next(updatedProducts);
      toastr.success('Product edited successfully', 'Success', { timeOut: 3000 });
    });

    component.editProduct(component.dataSource.data[0]);
    fixture.detectChanges(); // Trigger change detection

    expect(productService.editProduct).toHaveBeenCalledWith(jasmine.objectContaining({ id: '1', productName: 'Edited Product', url: 'https://example.com' }));
    expect(toastrSpy).toHaveBeenCalledWith('Product edited successfully', 'Success', { timeOut: 3000 });
  });

  it('should remove a product and show a toastr message', () => {
    const toastrSpy = spyOn(toastr, 'success').and.callThrough();

    component.dataSource.data = [{ id: '1', productName: 'Product', url: 'https://example.com' }];
    productService.removeProduct.and.callFake((id: string) => {
      const currentProducts = productsSubject.getValue().filter(product => product.id !== id);
      productsSubject.next(currentProducts);
      toastr.success('Product removed successfully', 'Success', { timeOut: 3000 });
    });

    component.removeProduct('1');
    fixture.detectChanges(); // Trigger change detection

    expect(productService.removeProduct).toHaveBeenCalledWith('1');
    expect(productsSubject.getValue().length).toBe(0); // Ensure the product is removed
    expect(toastrSpy).toHaveBeenCalledWith('Product removed successfully', 'Success', { timeOut: 3000 });
  });
});
