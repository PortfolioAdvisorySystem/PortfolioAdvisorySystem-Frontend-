export class Admin {}
export interface Rule {
  id:number;
  name: string;
  type: string;
  threshold: string;
  priority: string;
  effectiveDate: string;
  status: 'ACTIVE' | 'INACTIVE';
  ruleType:string,
  active:boolean
}
export interface AuditLog {
  id: number;
  action: string;
  details: string;
  performedBy: string;
  entityId: number;
  entityType: string;
  timestamp: string;
}
type Risk = 'LOW' | 'MEDIUM' | 'HIGH';
export interface Stock {
    id:number;
  symbol: string;
  sector: string;
  price: number;
  liquidity: number;
  riskCategory: Risk;
  active:boolean;
  avgVolume:number;
  marketCap:number;
  category:string;
}
type Status = 'ACTIVE' | 'PAUSED' | 'EXITED';
export interface Subscriber {
  id: string;
  name: string;
  aum: number;
  risk: 'Conservative' | 'Moderate' | 'Aggressive';
  onboarded: string;
  status: Status;
}