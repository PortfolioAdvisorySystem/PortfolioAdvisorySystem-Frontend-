export class Admin {}
export interface Rule {
  id: string;
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