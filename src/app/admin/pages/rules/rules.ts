import { Component,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Rule } from '../../../models/admin';
import { ApiServices } from '../../../services/api-services';

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

  rules: Rule[] = [];
  filteredRules: Rule[] = [];

  constructor(private apiService: ApiServices,private cdr:ChangeDetectorRef) {}

  ngOnInit() {
    this.apiService.getRules().subscribe({
      next: (data: Rule[]) => {
        console.log("API RESPONSE:", data);
        this.rules = data.map(rule => ({
          ...rule,
          status: rule.active ? 'ACTIVE' : 'INACTIVE'
        }));
        
        this.applyFilters(); 
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading rules', err);
      }
    });
  }

  applyFilters() {

  this.filteredRules = this.rules.filter(rule => {

    const search = this.searchTerm.toLowerCase();

    const matchesSearch =
      String(rule.id).toLowerCase().includes(search) ||
      (rule.name || '').toLowerCase().includes(search) ||
      (rule.ruleType || '').toLowerCase().includes(search);

    const matchesStatus =
      this.selectedStatus === 'ALL' ||
      (this.selectedStatus === 'ACTIVE' && rule.active) ||
      (this.selectedStatus === 'INACTIVE' && !rule.active);

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
    this.newRule = this.getEmptyRule();
  }

getEmptyRule() {
  return {
    name: '',
    ruleType: 'SECTOR_CAP',  
    threshold: '',
    targetStockSymbol: '',
    targetSector: '',
    targetRiskProfile: '',
    effectiveDate: '',
    expiryDate: '',
    priority: '',
    description: ''
  };
}

addRule() {

  if (
    !this.newRule.name ||
    !this.newRule.ruleType ||
    !this.newRule.priority ||
    !this.newRule.effectiveDate
  ) {
    this.formError = 'All required fields must be filled';
    return;
  }

  const payload = {
  name: this.newRule.name,
  ruleType: this.newRule.ruleType,

  threshold: this.newRule.threshold
    ? Number(this.newRule.threshold)
    : null,

  targetStockSymbol: this.newRule.targetStockSymbol?.trim() || null,
  targetSector: this.newRule.targetSector?.trim() || null,
  targetRiskProfile: this.newRule.targetRiskProfile?.trim() || null,

  effectiveDate: this.newRule.effectiveDate,

  expiryDate: this.newRule.expiryDate || null,

  priority: Number(this.newRule.priority),

  description: this.newRule.description?.trim() || null
};

  //console.log("PAYLOAD:", payload); 

  this.apiService.createRule(payload).subscribe({
    next: (savedRule: any) => {

      const mappedRule: Rule = {
        id: savedRule.id,
        name: savedRule.name,
        type: savedRule.ruleType,
        threshold: savedRule.threshold + '%',
        priority: 'P' + savedRule.priority,
        effectiveDate: savedRule.effectiveDate,
        status: savedRule.active ? 'ACTIVE' : 'INACTIVE',
        ruleType: savedRule.ruleType,
        active: savedRule.active
      };

      this.rules.unshift(mappedRule);
      this.applyFilters();
      this.closeModal();
    },
    error: (err) => {
      console.error('Create rule failed', err);
      this.formError = 'Backend validation failed';
    }
  });
}

  toggleStatus(rule: Rule) {

  if (rule.active) {
    this.apiService.deactivateRule(rule.id).subscribe({
      next: () => {
        rule.active = false;
        rule.status = 'INACTIVE';
        this.applyFilters();
      },
      error: (err) => {
        console.error('Deactivate failed', err);
        alert('Failed to deactivate rule');
      }
    });

  } else {
    
    this.apiService.activateRule(rule.id).subscribe({
      next: () => {
        rule.active = true;
        rule.status = 'ACTIVE';
        this.applyFilters();
      },
      error: (err) => {
        console.error('Activate failed', err);
        alert('Failed to activate rule');
      }
    });
  }

}
  clearError() {

  console.log('Clearing errors');

}
}