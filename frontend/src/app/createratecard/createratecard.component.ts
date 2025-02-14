import { WorkFieldService } from './../work-field.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-createratecard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './createratecard.component.html',
  styleUrls: ['./createratecard.component.css'],
})
export class CreateRateCardComponent implements OnInit {
  rateCardForm: FormGroup;
  productRateCardForm: FormGroup;



  works: {
    id: number;
    workfieldName: string;
    createdAt: string;
    updatedAt: string;
  }[] = [];



  contractors: {
    id: number;
    name: string;
    mobileNumber: string;
    email: string;
    workFieldId: number;
    address: string;
    createdAt: string;
    updatedAt: string;
  }[] = [];
  productsData: {
    id: number;
    productName: string;
    rate: number;
    workArea: string;
    contractorId: number;
    createdAt: string;
    updatedAt: string;
  }[] = [];

  selectedWorkField: string = ''; // Initialize selected work field
  rateCardData: any; // Define rateCardData property to hold the submitted data
  newWorkField: string = '';

  constructor(
    private fb: FormBuilder,

    private router: Router,
    private workFieldService: WorkFieldService
  ) {
    // Contractor form group
    this.rateCardForm = this.fb.group({
      contractorName: ['', [Validators.required, Validators.minLength(3)]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      work: ['', Validators.required],
    });

    // Product rate card form with FormArray for dynamic products
    this.productRateCardForm = this.fb.group({
      products: this.fb.array([this.createProductForm()]),
    });
  }

  // Correct ngOnInit implementation
  ngOnInit(): void {
    // Fetch work fields on component initialization
    this.workFieldService.getWorkFields().subscribe({
      next: (data) => {
        console.log('Work Fields:', data);
        if (Array.isArray(data)) {
          this.works = data; // Assign fetched work fields
        } else {
          console.error('Invalid data format:', data);
        }
        this.newWorkField = ''; // Reset new work field input
      },
      error: (error) => {
        console.error('Error fetching work fields:', error);
      },
    });

    // 🟢 Define `productData` before using it
    const productData = {
      name: 'Sample Product', // Replace with actual data
      price: 100,
      workFieldId: 1,
    };


    // Add a new product with defined data
    // this.workFieldService.addProduct(productData).subscribe({
    //   next: (data) => {
    //     console.log('Products:', data);
    //     if (Array.isArray(data)) {
    //       this.productsData = data; // Assign fetched product list
    //     } else {
    //       console.error('Invalid products format:', data);
    //       this.productsData = []; // Fallback to an empty array
    //     }
    //   },
    //   error: (error) => {
    //     console.error('Error adding product@@@@@@@@@:', error);
    //   }
    // });
  }

  // Getter methods for form controls
  get contractorName() {
    return this.rateCardForm.get('contractorName');
  }

  get mobile() {
    return this.rateCardForm.get('mobile');
  }

  get email() {
    return this.rateCardForm.get('email');
  }

  get address() {
    return this.rateCardForm.get('address');
  }

  get work() {
    return this.rateCardForm.get('work');
  }

  addNewWorkField() {
    if (this.newWorkField.trim()) {
      this.workFieldService
        .saveWorkField({ workfieldName: this.newWorkField.trim() })
        .subscribe(
          () => {
            // Fetch the updated work fields after successful addition
            this.workFieldService.getWorkFields().subscribe(
              (data) => {
                this.works = data;
                this.newWorkField = ''; // Clear the input
              },
              (error) =>
                console.error('Error fetching updated work fields:', error)
            );
          },
          (error) => console.error('Error adding work field:', error)
        );
    }
  }
  loadWorkFields(): void {
    this.workFieldService.getWorkFields().subscribe(
      (data) => {
        console.log('Fetched Work Fields:', data);
        this.works = data; // Assign work fields to the array
      },
      (error) => {
        console.error('Error fetching work fields:', error);
      }
    );
  }

  // Delete work field
  deleteWorkField(id: number): void {
    if (confirm('Are you sure you want to delete this work field?')) {
      this.workFieldService.deleteWorkField(id).subscribe(
        () => {
          console.log('Work field deleted successfully');
          this.works = this.works.filter((work) => work.id !== id); // Remove from UI
        },
        (error) => {
          console.error('Error deleting work field:', error);
        }
      );
    }
  }

  // Create a product form group dynamically
  createProductForm(): FormGroup {
    return this.fb.group({
      productName: ['', Validators.required],
      rate: ['', [Validators.required, Validators.min(1)]],
      workArea: ['', Validators.required],
    });
  }

  // Add a new product dynamically
  get productForms(): FormArray {
    return this.productRateCardForm.get('products') as FormArray;
  }

  addmore(): void {
    this.productForms.push(this.createProductForm());
  }

  // Remove a product from the list
  removeProduct(index: number) {
    if (this.productForms.length > 1) {
      this.productForms.removeAt(index);
    } else {
      alert('At least one product is required.');
    }
  }
  // Update selected work field and sync product forms
  //  onWorkChange(event: Event) {
  //   const target = event.target as HTMLSelectElement; // Ensure the event target is an HTML select element
  //   this.selectedWorkField = target.value; // Get the selected work field value
  //   this.productForms.controls.forEach((productForm) => {
  //     productForm.get('workArea')?.setValue(this.selectedWorkField); // Update the work area in all product forms
  //   });
  // }

  onSubmit() {
    if (this.rateCardForm.valid && this.productRateCardForm) {
      const formValue = this.rateCardForm.value;
      const formValueprod = this.productRateCardForm.value.products;


      // ✅ Prepare contractor data
      const contractorData = {
        name: formValue.contractorName,
        mobileNumber: formValue.mobile,
        email: formValue.email,
        workFieldId: Number(formValue.work),
        address: formValue.address,
      };

      console.log('Prepared Contractor Data:', contractorData);

      // ✅ Save contractor first
      this.workFieldService.saveContractor(contractorData).subscribe({
        next: (contractorResponse: any) => {
          console.log('Contractor saved successfully:', contractorResponse);
          console.log(contractorResponse.id,"@@@@@@@@@@@@@@@@@@@");


          // ✅ Ensure the backend returns a valid contractor ID
          if (!contractorResponse.id) {
            console.error('Error: Contractor ID missing from response');
            return;
          }

          const contractorId = contractorResponse.id;
          const workfieldselected =this.works.find((work)=>work.id=== Number(formValue.work))
          if(!workfieldselected){
            console.error('Error: Work field not found');
            return;
          }

          console.log("!!!!!!!!!!!!!!!!!!!!!!!",formValueprod);



          // ✅ Map product array with the saved contractor ID
          const productsDataSave =   formValueprod.map(
            (product: any) => ({
              productName: product.productName,
              rate: product.rate,
              workArea: workfieldselected.workfieldName,
              contractorId: contractorId,
            })
          );

          console.log('Prepared Products Data:', productsDataSave);

          // ✅ Save products associated with the contractor
          if (productsDataSave.length > 0) {
            this.workFieldService.addProduct(productsDataSave).subscribe({
              next: (productResponse: any) => {
                console.log('Products saved successfully:', productResponse);
                this.router.navigate(['/listratecard']);
              },
              error: (error: any) => {
                console.error('Error saving products:', error);
              },
            });
          } else {
            console.warn('No products to save.');
            this.router.navigate(['/listratecard']);
          }
        },
        error: (error: any) => {
          console.error('Error saving contractor:', error);
        },
      });
    } else {
      console.error('Form is invalid, please check your inputs.');
    }
  }
}
