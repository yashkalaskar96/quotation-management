import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define and export interfaces for type safety
export interface Product {
  contractorId: number;
  id: number; // Unique ID for each product
  productName: string;
  quantity: number;
  rate: number | null;
  totalPrice: number;
  workArea?: string; // Optional field for work area
  editing?: boolean; // Optional field for UI state
}

export interface RateCard {
  contractorId: number;
  id: number; // Unique ID for each rate card
  contractorName: string;
  work: string;
  mobile?: string;  // Optional mobile property
  email?: string;   // Optional email property
  address?: string; // Optional address property
  products: Product[]; // Ensure products are included in the rate card
  expanded?: boolean;
  editing?: boolean; // Optional property for UI state
}

@Injectable({
  providedIn: 'root'
})
export class RateCardService {
  private rateCardData: RateCard[] = []; // Initialize an empty array to store rate card data
  private apiUrl = 'http://localhost/abc'; // Replace with your actual API base URL

  constructor(private http: HttpClient) {}

  // Method to fetch rate card data from the API


  // Method to save or update rate card data locally
  saveRateCardDataLocally(data: RateCard): void {
    const existingRateCardIndex = this.rateCardData.findIndex(card =>
      card.contractorName === data.contractorName && card.work === data.work
    );

    if (existingRateCardIndex > -1) {
      // Update existing contractor's products
      const existingProducts = this.rateCardData[existingRateCardIndex].products;
      this.rateCardData[existingRateCardIndex].products = this.removeDuplicateProducts([
        ...existingProducts,
        ...data.products
      ]);
    } else {
      // Store new rate card locally
      this.rateCardData.push(data);
    }

    console.log('Saved Rate Card Data Locally:', this.rateCardData);
  }

  // Method to save rate card data to the backend (API)

  // Method to retrieve local rate card data
  getRateCardDataLocally(): RateCard[] {
    return this.rateCardData;
  }


  // Method to get contractors by work field from local data
  getContractorsByWorkFieldLocally(workField: string): string[] {
    return this.rateCardData
      .filter(card => card.work === workField)
      .map(card => card.contractorName);
  }

  // Method to get a rate card by contractor name and work from local data
  getRateCardByContractorAndWorkLocally(contractorName: string, work: string): RateCard | undefined {
    return this.rateCardData.find(card =>
      card.contractorName === contractorName && card.work === work
    );
  }

  // Existing method to get contractors
  getContractors(): Observable<RateCard[]> {
    return this.http.get<RateCard[]>(`${this.apiUrl}/saveRateCard.php`); // Adjust this endpoint as needed
  }

  // Method to edit contractor details
  editContractor(rateCard: RateCard): Observable<RateCard> {
    return this.http.put<RateCard>(`${this.apiUrl}/saveRateCard.php/${rateCard.id}`, rateCard); // Adjust the endpoint as needed
  }

  // Method to remove duplicate products from the products array
  private removeDuplicateProducts(products: Product[]): Product[] {
    const uniqueProducts = new Map<string, Product>();
    products.forEach(product => {
      uniqueProducts.set(product.productName, product); // Use product name as key for uniqueness
    });
    return Array.from(uniqueProducts.values());
  }

  // Method to edit contractor data locally
  editContractorLocally(updatedContractor: RateCard): void {
    console.log(updatedContractor);

    const index = this.rateCardData.findIndex(card =>
      card.contractorName === updatedContractor.contractorName && card.work === updatedContractor.work
    );

    if (index > -1) {
      this.rateCardData[index] = updatedContractor;
      console.log('Updated contractor locally:', updatedContractor);
    } else {
      console.warn('Contractor not found for update.');
    }
  }

  // Method to delete contractor data locally
  deleteContractorLocally(contractorName: string, work: string): void {
    this.rateCardData = this.rateCardData.filter(card =>
      !(card.contractorName === contractorName && card.work === work)
    );
    console.log('Deleted contractor locally:', contractorName, work);
  }

  // Method to delete contractor data via API (backend)
  deleteRateCard(contractorId: number): Observable<any> {
    const url = `${this.apiUrl}/saveRateCard.php`; // Set the URL for the delete request
    return this.http.delete(url, {
      body: { id: contractorId } // Pass the contractor ID in the request body
    });
  }

  // Method to add a product to the rate card in the database
  addProductToContractor(contractorId: number, product: Product): Observable<any> {
    return this.http.post(`${this.apiUrl}/ratecards/${contractorId}/products/${product.id}`, product);
}


  // Method to update a product
  updateProduct(rateCardId: number, product: Product): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/ratecards/${rateCardId}/products/${product.id}`, product);
  }

  // Method to get contractor details with products
  getContractorWithProducts(contractorId: number): Observable<any> {
    const url = `${this.apiUrl}/${contractorId}`;
    return this.http.get(url);
  }

  // Method to delete a produc
  deleteProduct(contractorId: number, productId: number): Observable<any> {
    const url = `${this.apiUrl}/saveRateCard.php/${contractorId}/products/${productId}`;
    console.log('Attempting to delete product:', { contractorId, productId, url });
    return this.http.delete(url);
  }
}
