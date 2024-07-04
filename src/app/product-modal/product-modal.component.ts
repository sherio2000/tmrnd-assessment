import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, FormsModule, CommonModule],
  templateUrl: './product-modal.component.html',
  styleUrl: './product-modal.component.scss'
})
export class ProductModalComponent {
  isEdit: boolean;

  constructor(
    public dialogRef: MatDialogRef<ProductModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEdit = data ? true : false;
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.dialogRef.close({ action: this.isEdit ? 'edit' : 'add', product: form.value });
    }
  }

  onRemove() {
    this.dialogRef.close({ action: 'remove', product: this.data });
  }
}
