import { Component, OnInit, AfterViewInit } from '@angular/core';
import { RateCardService, RateCard } from '../rate-card.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from '../filter.pipe';
import $ from 'jquery';
import 'datatables.net';
import { RouterLink } from '@angular/router';
import { NgForm } from '@angular/forms';
import { WorkFieldService } from './../work-field.service';
import { Contractor, Product } from '../work-field.service';

@Component({
  selector: 'app-listratecard',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterPipe, RouterLink],
  templateUrl: './listratecard.component.html',
  styleUrls: ['./listratecard.component.css'],
})
export class ListratecardComponent implements OnInit, AfterViewInit {
  rateCardData: RateCard[] = [];
  searchTerm: string = '';
  showWorkFields: boolean = false;
  showProducts: boolean = false;
  ascending: boolean = true;

  works: {
    id: number;
    workfieldName: string;
    createdAt: string;
    updatedAt: string;
  }[] = [];

  workFields: {
    id: number;
    workfieldName: string;
    createdAt: string;
    updatedAt: string;
    editing?: boolean;
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
    expanded?: boolean;
    ascending: boolean;
  }[] = [];

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


  // Arrays to hold new product inputs for each rate card
  newProductName: string[] = [];
  newProductRate: (number | null)[] = [];
  newProductWorkArea: string[] = [];
  newWorkField: string = '';

  // Track visibility of product inputs for each rate card
  showProductInputs: boolean[] = [];

  constructor(
    private rateCardService: RateCardService,
    private workFieldService: WorkFieldService
  ) {}

  ngOnInit(): void {
    this.workFieldService.getWorkFields().subscribe(
      (data) => {
        console.log(data);

        // Ensure the response is an array of objects as expected
        if (Array.isArray(data)) {
          this.workFields = data; // Assign the fetched work fields to the 'works' array
        } else {
          console.error('Invalid data format:', data);
        }
        this.newWorkField = ''; // Reset new work field input
      },
      (error) => {
        console.error('Error fetching updated work fields:', error);
      }
    );


    // Fetch contractors on component initialization
    this.getContractors();
    this.getProducts();

  }

  toggleWorkFields() {
    this.showWorkFields = !this.showWorkFields; // Toggle visibility
  }

  ngAfterViewInit() {
    this.initDataTable();
  }

  // Fetch all contractors
  getContractors(): void {
    this.workFieldService.getContractors().subscribe(
      (contractors) => {
        console.log('Contractors:', contractors);

        // Preserve expanded state while updating the contractors list
        const contractorMap = new Map(
          this.contractors?.map((c) => [c.id, c.expanded])
        );

        this.contractors = contractors.map((contractor: any) => ({
          ...contractor,
          expanded: contractorMap.get(contractor.id) ?? false, // Retain previous expanded state or default to false
        }));
      },
      (error) => {
        console.error('Error fetching contractors:', error);
      }
    );
  }


  getWorkfields() {
    this.workFieldService.getWorkFields().subscribe(
      (data) => {
        this.workFields = data.map((wf) => ({ ...wf, editing: false }));
      },
      (error) => console.error('Error fetching work fields:', error)
    );
  }

  enableEditModewf(workfield: any) {
    workfield.editing = true;
  }

  saveWorkfield(workfield: any) {
    this.workFieldService
      .updateWorkField(workfield.id, { workfieldName: workfield.workfieldName }) // Send only necessary data

      .subscribe(
        (response) => {
          console.log('Workfield updated successfully:', response);
          workfield.editing = false; // Exit edit mode after update
          this.getWorkfields();
        },
        (error) => console.error('Error updating work field:', error)
      );
    this.getWorkfields();
  }

  cancelEditz(workfield: any) {
    workfield.editing = false;
    this.getWorkfields(); // Reload original data
  }

  deleteWorkField(id: number) {
    if (confirm('Are you sure you want to delete this work field?')) {
      this.workFieldService.deleteWorkField(id).subscribe(
        () => {
          this.workFields = this.workFields.filter((wf) => wf.id !== id);
          this.getWorkfields();
          console.log('Workfield deleted successfully');
        },
        (error) => console.error('Error deleting work field:', error)
      );
    }
  }
  getWorkFieldName(workFieldId: number): string {
    const workField = this.workFields.find(wf => wf.id === workFieldId);
    return workField ? workField.workfieldName : 'N/A';
  }


  // Initialize product input arrays and visibility
  initializeProductInputs() {
    this.showProductInputs = Array(this.rateCardData.length).fill(false);
    this.newProductName = Array(this.rateCardData.length).fill('');
    this.newProductRate = Array(this.rateCardData.length).fill(null);
    this.newProductWorkArea = Array(this.rateCardData.length).fill('');
  }

  initDataTable() {
    setTimeout(() => {
      $('#rateCardTable').DataTable();
    }, 0);
  }

  sort<T extends Contractor | Product>(array: T[], column: keyof T) {
    array.sort((a, b) => this.compareValues(a[column], b[column]));
    this.ascending = !this.ascending;
  }

  compareValues(a: any, b: any): number {
    if (typeof a === 'string' && typeof b === 'string') {
      return this.ascending ? a.localeCompare(b) : b.localeCompare(a);
    } else if (typeof a === 'number' && typeof b === 'number') {
      return this.ascending ? a - b : b - a;
    }
    return 0;
  }

  filterRateCards() {
    if (!this.rateCardData || !Array.isArray(this.rateCardData)) {
      return [];
    }

    const search = this.searchTerm?.toLowerCase() || "";

    return this.rateCardData.filter((rateCard) => {
      const contractor = rateCard.contractorName?.toLowerCase() || "";
      const work = rateCard.work?.toLowerCase() || "";
      return contractor.includes(search) || work.includes(search);
    });
  }


  toggleProducts(contId: number) {
    const conttottle = this.contractors.find((contractorbhai) => contractorbhai.id === contId);

    if (!conttottle) {
      return; // Exit if contractor is not found
    }

    conttottle.expanded = !conttottle.expanded; // Toggle the expanded property
  }


  enableEditMode(rateCard: RateCard) {
    rateCard.editing = true;
  }

  saveEditedContractor(contractor: any) {
    this.workFieldService.updateContractor(contractor.id, contractor).subscribe(
      (response) => {
        console.log(
          'Updated contractor details sent to the backend:',
          response
        );
        this.getContractors();
        this.sort(this.contractors, "name"); // Sort contractors by name
        contractor.editing = false;
      },
      (error) => {
        console.error(
          'Error while sending updated details to the backend:',
          error
        );
      }
    );
  }

  cancelEdit(rateCard: RateCard) {
    rateCard.editing = false;
  }

  deleteContractor(contractorId: number): void {
    const confirmation = confirm(
      'Are you sure you want to delete this contractor?'
    );

    if (confirmation) {
      this.workFieldService.deleteContractor(contractorId).subscribe(
        (response) => {
          console.log('Contractor deleted successfully:', response);
          this.getContractors();
        },
        (error) => {
          console.error('Error deleting contractor:', error);
        }

      );


    } else {
      console.log('Deletion canceled by the user.');
    }
  }

  enableProductEditMode(product: any) {
    product.editing = true;
  }

  saveEditedProduct(contractorId: number, product: any) {
    if (product.productName.trim() === '' || product.rate <= 0) {
      alert('Please enter valid product details.');
      return;
    }

    this.workFieldService.updateProduct(product.id, {
      productName: product.productName,
      rate: product.rate,
      workArea: product.workArea,
      contractorId: contractorId
    }).subscribe(
      (response) => {
        console.log('Product updated:', response);
        product.editing = false; // Exit edit mode
      },
      (error) => {
        console.error('Error updating product:', error);
        alert('Failed to update product.');
      }
    );
  }


  // Toggle to show product input boxes for a specific rate card
  toggleAddProduct(index: number) {
    this.showProductInputs[index] = !this.showProductInputs[index];
  }

  // Method to add a product to the contractor's products


  generateUniqueId(): number {
    return Math.floor(Math.random() * 1000000);
  }

  cancelProductEdit(product: any) {
    product.editing = false;
  }

  deleteProduct(contractorId: number, productId: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.workFieldService.deleteProduct(productId).subscribe(
        (response) => {
          console.log('Product deleted:', response);
          this.products = this.products.filter(p => p.id !== productId);
        },
        (error) => {
          console.error('Error deleting product:', error);
          alert('Failed to delete product.');
        }
      );
    }
  }






  getContractorProducts(contractorId: number) {
    return this.products.filter(product => product.contractorId === contractorId);
  }

  getProducts(){
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

addmoreproducts(contractorId: number, index: number) {
  if (!this.newProductName[index] || !this.newProductRate[index] || !this.newProductWorkArea[index]) {
    console.error('Please fill in all product details before adding.');
    return;
  }

  const newProduct = {
    productName: this.newProductName[index],
    rate: this.newProductRate[index],
    workArea: this.newProductWorkArea[index],
    contractorId: contractorId,
  };

  console.log('Adding product:', newProduct);

  this.workFieldService.addProduct([newProduct]).subscribe({
    next: (productResponse: any) => {
      console.log('Product added successfully:', productResponse);

      // Reset input fields after adding the product
      this.newProductName[index] = '';
      this.newProductRate[index] = NaN;
      this.newProductWorkArea[index] = '';
      this.showProductInputs[index] = false;
    },
    error: (error: any) => {
      console.error('Error adding product:', error);
    },
  });
}


}
