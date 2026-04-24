import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rules',
  imports: [CommonModule, FormsModule],
  templateUrl: './rules.html',
  styleUrl: './rules.css',
})
export class Rules {
  searchTerm: string = '';
  selectedStatus: string = 'ALL';
  formError: string = '';

  rules = [
    {
      id: 'R-1001',
      name: 'Tech sector cap',
      type: 'SECTOR_CAP',
      threshold: '25%',
      priority: 'P1',
      effective: '2025-01-01',
      status: 'ACTIVE'
    },
    {
      id: 'R-1002',
      name: 'Single stock concentration',
      type: 'CONCENTRATION',
      threshold: '10%',
      priority: 'P2',
      effective: '2025-01-01',
      status: 'ACTIVE'
    },
    {
      id: 'R-1003',
      name: 'Minimum liquidity',
      type: 'LIQUIDITY',
      threshold: '40%',
      priority: 'P3',
      effective: '2025-02-14',
      status: 'ACTIVE'
    },
    {
      id: 'R-1004',
      name: 'High-risk cap (Aggressive)',
      type: 'RISK_LIMIT',
      threshold: '35%',
      priority: 'P4',
      effective: '2025-03-01',
      status: 'ACTIVE'
    },
    {
      id: 'R-1005',
      name: 'Sanctioned issuers',
      type: 'BLACKLIST',
      threshold: '0%',
      priority: 'P10',
      effective: '2024-11-10',
      status: 'INACTIVE'
    }
  ];

  filteredRules = [...this.rules];


  applyFilters() {

    this.filteredRules = this.rules.filter(rule => {

      //  SEARCH FILTER
      const search = this.searchTerm.toLowerCase();

      const matchesSearch =
        rule.id.toLowerCase().includes(search) ||
        rule.name.toLowerCase().includes(search) ||
        rule.type.toLowerCase().includes(search);

      //  STATUS FILTER
      const matchesStatus =
        this.selectedStatus === 'ALL' ||
        rule.status === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }

  isModalOpen = false;

  newRule: any = this.getEmptyRule();

  openModal() {
    this.isModalOpen = true;
    this.formError = '';
  }

  closeModal() {
    this.isModalOpen = false;
    this.formError = '';
    this.newRule = this.getEmptyRule();
  }

  clearError() {
    if (this.formError) {
      this.formError = '';
    }
  }

  getEmptyRule() {
    return {
      name: '',
      type: 'SECTOR_CAP',
      threshold: '',
      priority: '',
      effective: '',
      expiry: ''
    };
  }

  addRule() {

    // VALIDATION CHECK
    if (
      !this.newRule.name ||
      !this.newRule.type ||
      !this.newRule.threshold ||
      !this.newRule.priority ||
      !this.newRule.effective
    ) {
      this.formError = 'All fields are required';
      return;
    }

    //  CLEAR ERROR
    this.formError = '';

    const newId = 'R-' + (1000 + this.rules.length + 1);

    const ruleToAdd = {
      id: newId,
      name: this.newRule.name,
      type: this.newRule.type,
      threshold: this.newRule.threshold + '%',
      priority: 'P' + this.newRule.priority,
      effective: this.newRule.effective,
      status: 'ACTIVE'
    };

    this.rules.unshift(ruleToAdd);

    this.applyFilters();
    this.closeModal();
  }

  toggleStatus(rule: any) {
    rule.status = rule.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

    // re-apply filters so UI stays consistent
    this.applyFilters();
  }
}
