import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { NgIf, NgFor, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-modify-products',
  templateUrl: './modify-products.component.html',
  styleUrls: ['./modify-products.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor, CurrencyPipe]
})
export class ModifyProductsComponent implements OnInit {
  productForm: FormGroup;
  products: any[] = [];
  isUpdating = false;
  currentProductId: string | null = null;

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
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe(
      (data) => {
        this.products = data;
      },
      (error) => {
        console.error('Error loading products:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      if (this.isUpdating && this.currentProductId) {
        this.productService.updateProduct(this.currentProductId, this.productForm.value).subscribe(
          (response) => {
            this.loadProducts();
            this.isUpdating = false;
            this.currentProductId = null;
            this.productForm.reset();
          },
          (error) => {
            console.error('Error updating product:', error);
          }
        );
      } else {
        this.productService.createProduct(this.productForm.value).subscribe(
          (response) => {
            this.loadProducts();
            this.productForm.reset();
          },
          (error) => {
            console.error('Error creating product:', error);
          }
        );
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
      this.productService.deleteProduct(id).subscribe(
        () => {
          this.loadProducts();
        },
        (error) => {
          console.error('Error deleting product:', error);
        }
      );
    } else {
      console.error('Product ID is undefined');
    }
  }
}
