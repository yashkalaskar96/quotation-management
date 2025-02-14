import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-createquotation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './createquotation.component.html',
  styleUrls: ['./createquotation.component.css'],
})
export class CreatequotationComponent implements OnInit {
  quotationForm: FormGroup;


  constructor(private fb: FormBuilder, private http: HttpClient) {
    const today = new Date().toISOString().split('T')[0];
    // Initialize the form
    this.quotationForm = this.fb.group({
      discount: [
        null,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      quotationNumber: ['', Validators.required],
      clientName: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      quotationDate: [today, Validators.required],
      expiryDate: ['', Validators.required],
      address: ['', [Validators.required, Validators.minLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      total: [{ value: 0, disabled: true }],
      products: this.fb.array([]), // Assuming you're using FormArray for products
      workFieldGroups: this.fb.array([]),
    });
  }
  workFields: string[] = [];
  selectedWorkField: string = '';


  addWorkFieldGroup(): void {
    const workFieldGroup = this.fb.group({
      workField: ['', Validators.required],
      contractor: ['', Validators.required],
      products: this.fb.array([]) // Each work field group has its own product list
    });

    this.workFieldGroups.push(workFieldGroup);
  }

  removeWorkFieldGroup(index: number): void {
    this.workFieldGroups.removeAt(index);
  }
    // Get products array from a specific workFieldGroup
    getProducts(workFieldGroup: FormGroup): FormArray {
      return workFieldGroup.get('products') as FormArray;
    }

  get discount() {
    return this.quotationForm.get('discount');
  }

  ngOnInit(): void {
    this.addProduct(); // Add an initial product input
    this.fetchWorkFields();
  }

  // Get the products FormArray
  get products(): FormArray {
    return this.quotationForm.get('products') as FormArray;
  }

  get workFieldGroups(): FormArray {
    return this.quotationForm.get('workFieldGroups') as FormArray;
  }
  fetchWorkFields(): void {
    this.http
      .get<any[]>('http://localhost:3000/workfield/getallworkfields')
      .subscribe({
        next: (fields) => {
          console.log('Response from API:', fields); // Log the entire response
          this.workFields = fields.map((field) => field.workfieldName);
        },
        error: (err) => console.error('Error fetching workfields:', err),
      });
  }

  onWorkFieldChange(event: Event): void {
    const selectedField = (event.target as HTMLSelectElement).value;
    console.log('Selected Work Field:', selectedField);
  }
  // loadWorkFields(): void {
  //   this.http.get<string[]>('http://localhost:3000/workfield/getallworkfield')
  //     .subscribe({
  //       next: (data: any) => {
  //         this.workFields = data.workfields.map((field: any) => field.workfieldName);
  //       },
  //       error: (err) => console.error('Failed to fetch work fields:', err),
  //     });}

  // Method to add a new product
  addProduct(): void {
    const productGroup = this.fb.group({
      productName: ['', Validators.required],
      quantity: [[Validators.required, Validators.min(0)]],
      area: [[Validators.required, Validators.min(0)]],
      rate: [[Validators.required, Validators.min(0)]],
      totalPrice: [{ value: 0 }], // Correctly set totalPrice as disabled
    });

    // Add the new product group to the FormArray
    this.products.push(productGroup);

    // Update total price when quantity or unit price changes
    productGroup
      .get('quantity')
      ?.valueChanges.subscribe(() => this.calculateTotalPrice(productGroup));
    productGroup
      .get('unitPrice')
      ?.valueChanges.subscribe(() => this.calculateTotalPrice(productGroup));
  }

  // Method to remove a product
  removeProduct(index: number): void {
    this.products.removeAt(index);
  }

  // Calculate total price for a product
  calculateTotalPrice(productGroup: FormGroup): void {
    const quantity = productGroup.get('quantity')?.value || 0;
    const area = productGroup.get('area')?.value;
    const rate = productGroup.get('rate')?.value;
    const totalPrice = quantity * area * rate;
    productGroup.get('totalPrice')?.setValue(totalPrice); // This will not trigger an error
  }

  // Method to handle form submission
  onSubmit(): void {
    if (this.quotationForm.valid) {
      console.log('Quotation Form Data:', this.quotationForm.value);
      // Here you can add the logic to send the form data to your backend
    } else {
      this.quotationForm.markAllAsTouched(); // Mark all fields as touched to show validation errors
    }
  }
  calculateGrandTotal(): number {
    return this.products.controls.reduce((total, product) => {
      const quantity = product.get('quantity')?.value || 0;
      const area = product.get('area')?.value || 0;
      const rate = product.get('rate')?.value || 0;
      const productTotal = quantity * area * rate;
      return total + productTotal;
    }, 0);
  }
  calculateTotal(): number {
    const grandTotal = this.calculateGrandTotal();
    const discount = this.quotationForm.get('discount')?.value || 0;

    // Ensure discount is within a valid range (0-100)
    if (discount < 0 || discount > 100) {
      return Math.round(grandTotal); // If discount is invalid, return rounded grand total without changes
    }

    const discountAmount = (grandTotal * discount) / 100;
    const totalAfterDiscount = grandTotal - discountAmount;

    // Round the total to the nearest integer
    const roundedTotal = Math.round(totalAfterDiscount);

    // Set the rounded total in the form control
    this.quotationForm
      .get('total')
      ?.setValue(roundedTotal, { emitEvent: false });

    return roundedTotal;
  }
}
