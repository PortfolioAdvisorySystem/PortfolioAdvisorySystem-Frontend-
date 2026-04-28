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
        rule.name.toLowerCase().includes(search) ||
        rule.type.toLowerCase().includes(search);

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
      type: 'SECTOR_CAP',
      threshold: '',
      priority: '',
      effectiveDate: '',
      expiry: '',
      active: false
    };
  }

  addRule() {
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
    
    this.formError = '';

    const newId = 'R-' + (1000 + this.rules.length + 1);

    const ruleToAdd: Rule = {
      id: newId,
      name: this.newRule.name,
      type: this.newRule.type,
      threshold: this.newRule.threshold + '%',
      priority: 'P' + this.newRule.priority,
      effectiveDate: this.newRule.effectiveDate,
      status: 'ACTIVE', 
      ruleType: this.newRule.type,
      active: true
    };

    this.rules.unshift(ruleToAdd);

    this.applyFilters(); 

    this.closeModal();
  }

  toggleStatus(rule: Rule) {
    rule.active = !rule.active;
    rule.status = rule.active ? 'ACTIVE' : 'INACTIVE';

    this.applyFilters();
  }
  clearError() {
  console.log('Clearing errors');

}
}