import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from '../home/home.component';
import { of } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        HttpClientTestingModule,
        MatTableModule,
        MatPaginatorModule,
        MatDialogModule,
        RouterTestingModule,
        MatSnackBarModule,
        BrowserAnimationsModule
      ],
      providers: [MatDialog]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    dialog = TestBed.inject(MatDialog);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should add a product and show a snackbar message', () => {
    const snackBarSpy = spyOn(component['snackBar'], 'open').and.callThrough();
    spyOn(dialog, 'open').and.returnValue({
      afterClosed: () => of({ product: { id: '1', productName: 'New Product', url: 'https://example.com' } }) // Simulate adding a product
    } as any);

    const initialLength = component.dataSource.data.length;
    component.addProduct();
    expect(component.dataSource.data.length).toBe(initialLength + 1); // Ensure the product is added
    expect(snackBarSpy).toHaveBeenCalledWith('Product added successfully', 'Close', { duration: 3000 });
  });

  it('should show a snackbar message when fields are missing', () => {
    const snackBarSpy = spyOn(component['snackBar'], 'open').and.callThrough();
    spyOn(dialog, 'open').and.returnValue({
      afterClosed: () => of({ product: { productName: '', url: '' } }) // Simulate missing fields
    } as any);

    component.addProduct();
    expect(snackBarSpy).toHaveBeenCalledWith('All fields must be populated', 'Close', { duration: 3000 });
  });

  it('should edit a product and show a snackbar message', () => {
    spyOn(dialog, 'open').and.returnValue({
      afterClosed: () => of({ action: 'edit', product: { id: '1', productName: 'Edited Product', url: 'https://example.com' } })
    } as any);
    spyOn(component['snackBar'], 'open');

    component.dataSource.data = [{ id: '1', productName: 'Old Product', url: 'https://example.com' }];
    component.editProduct(component.dataSource.data[0]);
    expect(component.dataSource.data[0].productName).toBe('Edited Product');
    expect(component['snackBar'].open).toHaveBeenCalledWith('Product edited successfully', 'Close', { duration: 3000 });
  });

  it('should remove a product and show a snackbar message', () => {
    const snackBarSpy = spyOn(component['snackBar'], 'open').and.callThrough();
    spyOn(dialog, 'open').and.returnValue({
      afterClosed: () => of({ action: 'remove', product: { id: '1' } }) // Simulate removing a product
    } as any);

    component.dataSource.data = [{ id: '1', productName: 'Product', url: 'https://example.com' }];
    component.removeProduct('1');
    expect(component.dataSource.data.length).toBe(0); // Ensure the product is removed
    expect(snackBarSpy).toHaveBeenCalledWith('Product removed successfully', 'Close', { duration: 3000 });
  });
});
