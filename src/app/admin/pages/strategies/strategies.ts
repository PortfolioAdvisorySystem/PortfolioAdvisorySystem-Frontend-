import { Component ,ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiServices } from '../../../services/api-services';

@Component({
  selector: 'app-strategy',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './strategies.html',
  styleUrls: ['./strategies.css']
})
export class StrategiesComponent {

  constructor(private apiService: ApiServices,private cdr:ChangeDetectorRef) {}
  showModal = false;
  dropdownOpen = false;
  modalDropdownOpen = false;

  searchText = '';
  selectedProfile = 'All risk profiles';

  profiles = ['All risk profiles', 'Conservative', 'Moderate', 'Aggressive'];

  strategies: any[] = [];

  newStrategy = {
    name: '',
    profile: 'Moderate',
    stock: 8,
    sector: 25,
    cash: 5
  };

  toastMessage = '';
  showToast = false;

  ngOnInit() {
    this.loadStrategies();
  }

  loadStrategies() {
    this.apiService.getStrategies().subscribe({
      next: (data: any[]) => {
        this.strategies = data.map(s => ({
          id: 'STR-' + s.id, 
          name: s.name,

          profile: this.formatRisk(s.riskProfile),

          stock: s.maxStockConcentration,
          sector: s.maxSectorExposure,
          cash: s.cashBufferPercent,
          subs: 0,
          active: s.active
        }));
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching strategies', err);
      }
    });
  }

  formatRisk(risk: string): string {
    return risk.charAt(0).toUpperCase() + risk.slice(1).toLowerCase();
  }

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

  selectModalProfile(p: string) {
    this.newStrategy.profile = p;
    this.modalDropdownOpen = false;
  }

 submitStrategy() {
  if (!this.newStrategy.name.trim()) {
    this.showNotification('Enter strategy name');
    return;
  }

  const payload = {
    name: this.newStrategy.name,
    riskProfile: this.newStrategy.profile.toUpperCase(), 
    maxStockConcentration: this.newStrategy.stock,
    maxSectorExposure: this.newStrategy.sector,
    cashBufferPercent: this.newStrategy.cash,
    active: false 
  };

  this.apiService.createStrategy(payload).subscribe({
    next: (res: any) => {
      this.loadStrategies();

      this.showNotification('Strategy submitted for approval ');
      this.newStrategy = {
        name: '',
        profile: 'Moderate',
        stock: 8,
        sector: 25,
        cash: 5
      };

      this.showModal = false;
    },

    error: (err) => {
      console.error('Error creating strategy', err);
      this.showNotification('Failed to create strategy ');
    }
  });
}

  showNotification(msg: string) {
  this.toastMessage = msg;
  this.showToast = true;

  setTimeout(() => {
    this.showToast = false;
  }, 2500); 
}
}