import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Rule ,AuditLog} from '../models/admin';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
  
})
export class ApiServices {
  constructor(private http: HttpClient) {}
  private baseUrl = 'http://localhost:8080/api/subscriber';
  private adminUrl='http://localhost:8080/api';
addInflows(subscriberId: number, data: any) {
  return this.http.post(`${this.baseUrl}/${subscriberId}/inflow`, data);
}
getRules(): Observable<Rule[]> {
   
    return this.http.get<Rule[]>(`${this.adminUrl}/rules`);
  }

  saveRule(rule: any): Observable<Rule> {
    return this.http.post<Rule>(`${this.adminUrl}/rules`, rule);
  }

  updateRuleStatus(id: string, status: string): Observable<Rule> {
    return this.http.patch<Rule>(`${this.adminUrl}/rules/${id}`, { status });
  }
  getAuditLogs() {
  return this.http.get<AuditLog[]>(`${this.adminUrl}/reports/audit-logs`);
}
  getStrategies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.adminUrl}/strategies`);
  }

  getSubscribers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/subscribers`);
  }

  getMigrations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/migrations`);
  }

  getRebalances(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/rebalances`);
  }

  getRisks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/risks`);
  }

  getUnallocated(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/unallocated`);
  }

  getDeallocation(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/deallocation`);
  }
}
