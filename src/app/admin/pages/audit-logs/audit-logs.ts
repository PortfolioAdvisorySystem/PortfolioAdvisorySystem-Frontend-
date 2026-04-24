import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-audit-logs',
  standalone:true,
  imports: [CommonModule,FormsModule],
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
    { id: 'LOG-5000', entity: 'RULE', entityId: 'RUL-1000', action: 'CREATE', user: 'alice', when: '15m ago' },
    { id: 'LOG-4999', entity: 'STOCK', entityId: 'STO-1001', action: 'SUSPEND', user: 'bob', when: '1h ago' },
    { id: 'LOG-4998', entity: 'SUBSCRIBER', entityId: 'SUB-1002', action: 'STRATEGY_CHANGE', user: 'carol', when: '2h ago' },
  ];
  
  filteredLogs = [...this.logs];
  
  actions = [...new Set(this.logs.map(l => l.action))];
  
  searchText = '';
  selectedAction = '';
  
  applyFilters() {
    this.filteredLogs = this.logs.filter(log => {
  
      const matchesAction =
        !this.selectedAction || log.action === this.selectedAction;
  
      const search = this.searchText.toLowerCase();
  
      const matchesSearch =
        log.id.toLowerCase().includes(search) ||
        log.entity.toLowerCase().includes(search) ||
        log.user.toLowerCase().includes(search);
  
      return matchesAction && matchesSearch;
    });
  }
}