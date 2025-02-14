import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Contractor {
  id: number;
  name: string;
  mobileNumber: string;
  email: string;
  address: string;
  workFieldId: number;
  expanded?: boolean;
  editing?: boolean;
  workFieldName?: string;
}

export interface Product {
  id: number;
  productName: string;
  rate: number;
  workArea: string;
  editing?: boolean;
}


@Injectable({
  providedIn: 'root',
})
export class WorkFieldService {
  private apiUrl = 'http://localhost:3000'; // Update with your backend API URL

  constructor(private http: HttpClient) {}

  // ================= Work Field Methods =================

  // Save a new work field
  saveWorkField(workField: { workfieldName: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/workfield/addnew`, workField);
  }

  // Get all work fields
  getWorkFields(): Observable<
    { id: number; workfieldName: string; createdAt: string; updatedAt: string }[]
  > {
    return this.http.get<
      { id: number; workfieldName: string; createdAt: string; updatedAt: string }[]
    >(`${this.apiUrl}/workfield/getallworkfields`);
  }

  // Delete a work field
  deleteWorkField(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/workfield/delete/${id}`);
  }

  // Update a work field
  updateWorkField(id: number, updatedWorkfield: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/workfield/update/${id}`, updatedWorkfield);
  }

  // ================= Contractor Methods =================

  // Save a new contractor
  saveContractor(contractor: {
    name: string;
    mobileNumber: string;
    email: string;
    workFieldId: number;
    address: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/contractor/addnew`, contractor);
  }

  // Get all contractors
  getContractors(): Observable<
    { id: number; name: string; mobileNumber: string; email: string; workFieldId: number; address: string; createdAt: string; updatedAt: string }[]
  > {
    return this.http.get<
      { id: number; name: string; mobileNumber: string; email: string; workFieldId: number; address: string; createdAt: string; updatedAt: string }[]
    >(`${this.apiUrl}/contractor/getallcontractors`);
  }

  // Get contractors by work field
  getContractorsByWorkField(workFieldId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/contractor/byworkfield/${workFieldId}`);
  }

  // Delete a contractor
  deleteContractor(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/contractor/delete/${id}`);
  }

  // Update a contractor
  updateContractor(id: number, updatedContractor: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/contractor/update/${id}`, updatedContractor);
  }
  // Product Methods

  // saveProducts(products: { productName: string; rate: number; workArea: string; contractorId: number }[]): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/products/addnew`, { products });
  // }


  getProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/products/getallproducts`);
  }

  addProduct(productData: any): Observable<any> {
    console.log(`${this.apiUrl}/products/addnew!!!!!!!@@@@@@@@@@`);

    return this.http.post(`${this.apiUrl}/products/addnew`, productData);
  }


  updateProduct(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/products/update/${id}`, data);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/products/delete/${id}`);
  }

}
