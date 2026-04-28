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
    return this.http.get<any[]>(`${this.adminUrl}/reports/subscriber`);
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
  getStocks() {
  return this.http.get<any[]>(`${this.adminUrl}/stocks`);
}
//report page 
getStrategyReport() {
  return this.http.get<any[]>(`${this.adminUrl}/reports/allocation/strategy`);
}

getSubscriberReport() {
  return this.http.get<any[]>(`${this.adminUrl}/reports/subscriber`);
}

getMigrationReport() {
  return this.http.get<any[]>(`${this.adminUrl}/reports/migration-history`);//need developement
}

getRebalanceReport() {
  return this.http.get<any[]>(`${this.adminUrl}/reports/rebalance-history`);
}

getRiskReport() {
  return this.http.get<any[]>(`${this.adminUrl}/reports/rule-breach-summary`);
}

getUnallocatedReport() {
  return this.http.get<any[]>(`${this.adminUrl}/reports/unallocated-pool`);
}

getDeallocationReport() {
  return this.http.get<any[]>(`${this.adminUrl}/reports/deallocation-queue`);
}

//post req
createStrategy(data: any) {
  return this.http.post(`${this.adminUrl}/strategies`, data);
}
getDashboard() {
  return this.http.get<any>(`${this.adminUrl}/reports/dashboard`);
}

//update 
// blacklistStock(stockId: number) {
//   return this.http.post(`${this.adminUrl}/stocks/${stockId}/blacklist`, {});
// }
activateStock(stockId: number) {
  return this.http.put(`${this.adminUrl}/stocks/${stockId}/activate`, {});
}
suspendStock(stockId: number) {
  return this.http.put(`${this.adminUrl}/stocks/${stockId}/suspend`, {});
}
}
