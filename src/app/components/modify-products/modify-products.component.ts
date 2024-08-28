import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { NgIf, NgFor, CurrencyPipe, CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-modify-products',
  templateUrl: './modify-products.component.html',
  styleUrls: ['./modify-products.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgIf, NgFor, CurrencyPipe]
})
export class ModifyProductsComponent implements OnInit {
  productForm: FormGroup;
  products: any[] = [];
  isUpdating = false;
  currentProductId: string | null = null;
  alertMessage: string = '';
  showAlert = false;
  alertType: 'success' | 'error' = 'success';

  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      image: [''] // Include image field
    });
  }

  ngOnInit(): void {
    this.loadProducts().subscribe(products => {
      this.products = products; // Ensure products are updated
    });
  }

  loadProducts(): Observable<any[]> {
    return this.productService.getAllProducts().pipe(
      catchError(error => {
        console.error('Error loading products:', error);
        return of([]); // Return empty array on error
      })
    );
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;
      if (this.isUpdating && this.currentProductId) {
        if (confirm('Are you sure you want to update this product?')) {
          this.productService.updateProduct(this.currentProductId, formValue).pipe(
            switchMap(() => this.showAlertMessage('Product updated successfully', 'success')),
            switchMap(() => this.loadProducts()), // Reload products after update
            catchError(error => this.showAlertMessage('Error updating product', 'error'))
          ).subscribe(products => {
            this.products = products; // Update products
            this.productForm.reset(); // Reset form after successful update
            this.isUpdating = false;
            this.currentProductId = null;
          });
        }
      } else {
        if (confirm('Are you sure you want to add this product?')) {
          this.productService.createProduct(formValue).pipe(
            switchMap(() => this.showAlertMessage('Product added successfully', 'success')),
            switchMap(() => this.loadProducts()), // Reload products after adding
            catchError(error => this.showAlertMessage('Error adding product', 'error'))
          ).subscribe(products => {
            this.products = products; // Update products
            this.productForm.reset(); // Reset form after successful addition
          });
        }
      }
    }
  }

  onEdit(product: any): void {
    this.isUpdating = true;
    this.currentProductId = product._id || null;
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image || '' // Handle undefined
    });
  }

  onDelete(id: string | undefined): void {
    if (id) {
      if (confirm('Are you sure you want to delete this product?')) {
        this.productService.deleteProduct(id).pipe(
          switchMap(() => this.showAlertMessage('Product deleted successfully', 'success')),
          switchMap(() => this.loadProducts()), // Reload products after deletion
          catchError(error => this.showAlertMessage('Error deleting product', 'error'))
        ).subscribe(products => {
          this.products = products; // Update products
        });
      }
    } else {
      this.showAlertMessage('Product ID is undefined', 'error');
    }
  }

  private showAlertMessage(message: string, type: 'success' | 'error'): Observable<any> {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
    setTimeout(() => this.showAlert = false, 3000); // Hide alert after 3 seconds
    return of(null);
  }
}
