import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { WorkFieldService } from '../work-field.service';

@Component({
  selector: 'app-createquotation',
  standalone:true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './createquotation.component.html',
  styleUrls: ['./createquotation.component.css']
})
export class CreatequotationComponent implements OnInit {
  quotationForm!: FormGroup;

        
  constructor(private fb: FormBuilder,private http: HttpClient,private workFieldService: WorkFieldService ) {
  }

  allworkFields: {id: number; workfieldName: string; createdAt: string; updatedAt: string}[] = [];
  filteredContractors: any[] = [];
  selectedWorkFieldId: number | null = null;
  selectedContractorId: number | null = null;
  allContractor:  { id: number; name: string; mobileNumber: string; email: string; workFieldId: number; address: string; createdAt: string; updatedAt: string }[] = [];
  products: {
    id: number;
    productName: string;
    rate: number;
    workArea: string;
    contractorId: number;
    createdAt: string;
    updatedAt: string;
    editing?: boolean;
    ascending: boolean;

  }[] = [];
  contractorProducts: {
    id: number;
    productName: string;
    rate: number;
    workArea: string;
    contractorId: number;
    createdAt: string;
    updatedAt: string;
    editing?: boolean;
    ascending: boolean;

  }[] = [];

 
  ngOnInit() {
    this.quotationForm = this.fb.group({
      clientName: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      quotationDate: ['', Validators.required],
      expiryDate: ['', Validators.required],
      discount: [0, [Validators.min(0), Validators.max(100)]],
      workFields: this.fb.array([]) // Work Fields Array
    });
    this.addWorkField();
    this.fetchWorkFields();
    this.fetchContractors()
    this.fetchProducts()
  }

  
  getContractorProducts(contractorIds: number) {
    console.log("@@@@@@@@@!!!!!!!!!!",contractorIds);
    console.log(this.products);
    
    console.log(this.products.filter(product => product.contractorId === contractorIds));
    
    this.contractorProducts=this.products.filter(product => product.contractorId === contractorIds);
     
  }

  fetchProducts(){
    this.workFieldService.getProducts().subscribe(
      (data) => {
        console.log(data);
        if (Array.isArray(data)) {
          this.products = data;
        } else {
          console.error('Invalid data format:', data);
        }
      },
      (error) => {
        console.error('Error fetching updated work fields:', error);
      }
    );
  }


  onWorkFieldChange(event: any) {
    this.selectedWorkFieldId = event.target.value;
    this.filterContractors();  // Update filtered contractors list
  }
  onContractorChange(event: any) {  
    
    this.getContractorProducts(event.target.value);  // Update filtered contractors list
  }


  filterContractors() {
    if (!this.selectedWorkFieldId) {
      this.filteredContractors = this.allContractor;  // Show all contractors if nothing is selected
    } else {
      this.filteredContractors = this.allContractor.filter(
        contractor => contractor.workFieldId === Number(this.selectedWorkFieldId)
      );
    }
  }

  fetchWorkFields(): void {
    this.http
      .get<any[]>('http://localhost:3000/workfield/getallworkfields')
      .subscribe({
        next: (fields) => {
          console.log('Response from API@@@@:', fields); // Log the entire response
          this.allworkFields = fields.map((field) => field);
        },
        error: (err) => console.error('Error fetching workfields:', err),
      });
  }

  fetchContractors(): void {
    this.workFieldService.getContractors().subscribe(
      (contractors) => {
        console.log('Contractors:', contractors);

        // Preserve expanded state while updating the contractors list
        

        this.allContractor = contractors.map((contractor: any) => ({
          ...contractor
        }));
      },
      (error) => {
        console.error('Error fetching contractors:', error);
      }
    );
  }

  get workFields(): FormArray {
    return this.quotationForm.get('workFields') as FormArray;
  }

  addWorkField() {
    const workFieldGroup = this.fb.group({
      workFieldName: ['', Validators.required],
      contractors: this.fb.array([]),
      products: this.fb.array([]) // Each work field has its own product list
    });

    this.workFields.push(workFieldGroup);
  }

  removeWorkField(index: number) {
    this.workFields.removeAt(index);
  }

  getContractors(workFieldIndex: number): FormArray {
    return this.workFields.at(workFieldIndex).get('contractors') as FormArray;
  }

  addContractor(workFieldIndex: number) {
    const contractorGroup = this.fb.group({
      contractorName: ['', Validators.required]
    });

    this.getContractors(workFieldIndex).push(contractorGroup);
  }

  removeContractor(workFieldIndex: number, contractorIndex: number) {
    this.getContractors(workFieldIndex).removeAt(contractorIndex);
  }

  getProducts(workFieldIndex: number): FormArray {
    return this.workFields.at(workFieldIndex).get('products') as FormArray;
  }

  addProduct(workFieldIndex: number) {
    const productGroup = this.fb.group({
      productName: ['', Validators.required],
      rate: [0, Validators.required],
      area: [0, Validators.required],
      quantity: [0, Validators.required],
      totalPrice: [{ value: 0, disabled: true }]
    });

    this.getProducts(workFieldIndex).push(productGroup);
  }

  removeProduct(workFieldIndex: number, productIndex: number) {
    this.getProducts(workFieldIndex).removeAt(productIndex);
  }

  calculateGrandTotal(): number {
    let grandTotal = 0;
    this.workFields.controls.forEach(workField => {
      (workField.get('products') as FormArray).controls.forEach(product => {
        const rate = product.get('rate')?.value || 0;
        const area = product.get('area')?.value || 0;
        const quantity = product.get('quantity')?.value || 0;
        grandTotal += rate * area * quantity;
      });
    });
    return grandTotal;
  }

  calculateTotal(): number {
    const grandTotal = this.calculateGrandTotal();
    const discount = this.quotationForm.get('discount')?.value || 0;
    return grandTotal - (grandTotal * discount) / 100;
  }

  onSubmit() {
    if (this.quotationForm.valid) {
      console.log('Quotation Data:', this.quotationForm.value);
    }
  }
}
