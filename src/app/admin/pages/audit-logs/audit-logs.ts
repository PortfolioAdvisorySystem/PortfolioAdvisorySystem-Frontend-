import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiServices } from '../../../services/api-services';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './audit-logs.html',
  styleUrl: './audit-logs.css',
})
export class AuditLogs {

  logs: any[] = [];
  filteredLogs: any[] = [];

  actions: string[] = [];

  searchText = '';
  selectedAction = '';
  currentPage = 1;
  pageSize = 10;

  paginatedLogs: any[] = [];
  constructor(private apiService: ApiServices, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.apiService.getAuditLogs().subscribe({
      next: (data: any[]) => {
        this.logs = data.map(log => ({
          id: 'LOG-' + log.id,
          entity: log.entityType,
          entityId: log.entityId,
          action: log.action,
          user: log.performedBy,
          when: this.formatTime(log.timestamp)
        }));

        this.filteredLogs = [...this.logs];
        this.updatePagination();
        this.actions = [...new Set(this.logs.map(l => l.action))];

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching audit logs', err);
      }
    });
  }

  applyFilters() {
    this.filteredLogs = this.logs.filter(log => {

      const matchesAction =
        !this.selectedAction || log.action === this.selectedAction;

      const search = this.searchText.toLowerCase();

      const matchesSearch =
        String(log.id).toLowerCase().includes(search) ||
        String(log.entity).toLowerCase().includes(search) ||
        String(log.user).toLowerCase().includes(search);

      return matchesAction && matchesSearch;
    });
    this.currentPage = 1; // reset to first page
    this.updatePagination();
  }

  formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();

    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;

    return date.toLocaleDateString();
  }
  updatePagination() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;

    this.paginatedLogs = this.filteredLogs.slice(start, end);
  }
  nextPage() {
    if (this.currentPage * this.pageSize < this.filteredLogs.length) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }
}