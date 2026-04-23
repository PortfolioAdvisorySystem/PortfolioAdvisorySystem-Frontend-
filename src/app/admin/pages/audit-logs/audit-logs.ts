import { Component } from '@angular/core';

@Component({
  selector: 'app-audit-logs',
  imports: [],
  templateUrl: './audit-logs.html',
  styleUrl: './audit-logs.css',
})
export class AuditLogs {
  logs = [
    { id: 'LOG-5000', entity: 'RULE', entityId: 'RUL-1000', action: 'CREATE', user: 'alice', when: '15m ago' },
    { id: 'LOG-4999', entity: 'STOCK', entityId: 'STO-1001', action: 'SUSPEND', user: 'bob', when: '1h ago' },
    { id: 'LOG-4998', entity: 'SUBSCRIBER', entityId: 'SUB-1002', action: 'STRATEGY_CHANGE', user: 'carol', when: '2h ago' },
    { id: 'LOG-4997', entity: 'STRATEGY', entityId: 'STR-1003', action: 'UPDATE', user: 'system', when: '3h ago' },
    { id: 'LOG-4996', entity: 'WORKFLOW', entityId: 'WOR-1004', action: 'REJECT', user: 'alice', when: '3h ago' },
    { id: 'LOG-4995', entity: 'ALLOCATION', entityId: 'ALL-1005', action: 'DEALLOCATE', user: 'bob', when: '4h ago' },
    { id: 'LOG-4994', entity: 'RULE', entityId: 'RUL-1006', action: 'CREATE', user: 'carol', when: '5h ago' }
  ];
}