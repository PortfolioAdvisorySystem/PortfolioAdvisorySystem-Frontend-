import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-strategy',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './strategies.html',
  styleUrls: ['./strategies.css']
})
export class Strategies {

  // ===== UI =====
  showModal = false;
  dropdownOpen = false;
  modalDropdownOpen = false;

  // ===== FILTER =====
  searchText = '';
  selectedProfile = 'All risk profiles';

  profiles = ['All risk profiles', 'Conservative', 'Moderate', 'Aggressive'];

  // ===== DATA =====
  strategies = [
    { id: 'STR-01', name: 'Conservative Income', profile: 'Conservative', stock: 5, sector: 20, cash: 10, subs: 142 },
    { id: 'STR-02', name: 'Balanced Moderate', profile: 'Moderate', stock: 8, sector: 25, cash: 5, subs: 318 },
    { id: 'STR-03', name: 'Growth Aggressive', profile: 'Aggressive', stock: 12, sector: 35, cash: 3, subs: 221 },
    { id: 'STR-04', name: 'Tactical Income', profile: 'Conservative', stock: 6, sector: 22, cash: 8, subs: 189 }
  ];

  // ===== FORM =====
  newStrategy = {
    name: '',
    profile: 'Moderate',
    stock: 8,
    sector: 25,
    cash: 5
  };

  // ===== TOAST =====
  toastMessage = '';
  showToast = false;

  // ===== FILTER LOGIC =====
  get filteredStrategies() {
    return this.strategies.filter(s => {
      const matchProfile =
        this.selectedProfile === 'All risk profiles' ||
        s.profile === this.selectedProfile;

      const search = this.searchText.toLowerCase();

      const matchSearch =
        s.name.toLowerCase().includes(search) ||
        s.id.toLowerCase().includes(search);

      return matchProfile && matchSearch;
    });
  }

  selectProfile(p: string) {
    this.selectedProfile = p;
    this.dropdownOpen = false;
  }

  // ===== MODAL DROPDOWN =====
  selectModalProfile(p: string) {
    this.newStrategy.profile = p;
    this.modalDropdownOpen = false;
  }

  // ===== SUBMIT =====
  submitStrategy() {
    if (!this.newStrategy.name.trim()) {
      this.showNotification('Enter strategy name');
      return;
    }

    this.strategies.unshift({
      id: 'STR-0' + (this.strategies.length + 1),
      name: this.newStrategy.name,
      profile: this.newStrategy.profile,
      stock: this.newStrategy.stock,
      sector: this.newStrategy.sector,
      cash: this.newStrategy.cash,
      subs: 0
    });

    this.showNotification('Strategy submitted for approval ✅');

    // reset form
    this.newStrategy = {
      name: '',
      profile: 'Moderate',
      stock: 8,
      sector: 25,
      cash: 5
    };

    this.showModal = false;
  }

  showNotification(msg: string) {
    this.toastMessage = msg;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }
}