import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
  
})
export class ApiServices {
  constructor(private http: HttpClient) {}
  private baseUrl = 'http://localhost:8080/api/subscriber'
addInflows(subscriberId: number, data: any) {
  return this.http.post(`${this.baseUrl}/${subscriberId}/inflow`, data);
}

}
