import { Component,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiServices } from '../../../services/api-services';
import { Subscriber } from '../../../models/admin';

@Component({
  selector: 'app-subscriber',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subscribers.html',
  styleUrls: ['./subscribers.css']
})
export class SubscribersComponent {

  searchText = '';
  selectedStatus = 'ALL';
  selectedRisk = 'ALL';
  isOnboardOpen = false;
  sub_cnt=0;
  subscribers: Subscriber[] = [];
 subscriberPage = 1;
pageSize = 10;
totalPages=1;
  newSubscriber: any = this.getEmptySubscriber();

  constructor(private apiService: ApiServices,private cdr:ChangeDetectorRef) {}

  ngOnInit() {
    this.loadSubscribers();
  }

  loadSubscribers() {
    this.apiService.getSubscribers().subscribe({
      next: (data: any[]) => {
        this.totalPages=Math.ceil((data?.length || 0) / this.pageSize);
        this.sub_cnt=data.length;
        this.subscribers = data.map(s => ({
          id: s.subscriberId,
          name: s.name,
          aum: s.aum,
          risk: this.formatRisk(s.riskProfile),

          status: s.status,
          onboarded: 'Recently'
        }));
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching subscribers', err);
      }
    });
  }

  formatRisk(risk: string): any {
    return risk.charAt(0).toUpperCase() + risk.slice(1).toLowerCase();
  }


 get filteredSubscribers() {

  const result = this.subscribers.filter(s => {

    const search = this.searchText.toLowerCase();

    const searchMatch =
      String(s.id).toLowerCase().includes(search) ||
      (s.name || '').toLowerCase().includes(search);

    const statusMatch =
      this.selectedStatus === 'ALL' ||
      s.status === this.selectedStatus;

    const riskMatch =
      this.selectedRisk === 'ALL' ||
      s.risk === this.selectedRisk;

    return searchMatch && statusMatch && riskMatch;
  });

  // 🔥 Reset page if overflow
  if ((this.subscriberPage - 1) * this.pageSize >= result.length) {
    this.subscriberPage = 1;
  }

  return result;
}


  openOnboardModal() {
    this.isOnboardOpen = true;
  }

  closeOnboardModal() {
    this.isOnboardOpen = false;
    this.newSubscriber = this.getEmptySubscriber();
  }

  getEmptySubscriber() {
    return {
      name: '',
      aum: '',
      risk: 'Moderate'
    };
  }

  addSubscriber() {

    if (!this.newSubscriber.name || !this.newSubscriber.aum) return;

    const newSub: Subscriber = {
      id: 'SUB-' + (this.subscribers.length + 200),
      name: this.newSubscriber.name,
      aum: Number(this.newSubscriber.aum),
      risk: this.newSubscriber.risk,
      status: 'ACTIVE',
      onboarded: 'Just now'
    };

    this.subscribers.unshift(newSub);

    this.closeOnboardModal();
  }
  get paginatedSubscribers() {
  return this.paginate(this.filteredSubscribers, this.subscriberPage);
}
paginate(data: any[], page: number) {
  const start = (page - 1) * this.pageSize;
  return data.slice(start, start + this.pageSize);
}
nextPage() {
  if (this.subscriberPage * this.pageSize < this.filteredSubscribers.length) {
    this.subscriberPage++;
  }
}

prevPage() {
  if (this.subscriberPage > 1) {
    this.subscriberPage--;
  }
}
}