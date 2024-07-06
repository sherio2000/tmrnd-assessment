import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, FormsModule, CommonModule],
  templateUrl: './product-modal.component.html',
  styleUrl: './product-modal.component.scss'
})
export class ProductModalComponent {
  product: any = {
    productName: '',
    url: ''
  };
  constructor(
    public dialogRef: MatDialogRef<ProductModalComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService
  ) {
    if (data) {
      this.product = { ...data };
    }
  }

  onSubmit(form: NgForm) {
    if (!this.product.productName || !this.product.url) {
      this.toastr.error('All fields must be populated', 'Error', { timeOut: 3000 });
      return;
    }
    this.dialogRef.close({ action: this.data ? 'edit' : 'add', product: this.product });
  }

  onRemove() {
    this.dialogRef.close({ action: 'remove', product: this.data });
  }
}
