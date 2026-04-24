import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Status = 'ACTIVE' | 'PAUSED' | 'EXITED';

interface Subscriber {
  id: string;
  name: string;
  aum: number;
  risk: 'Conservative' | 'Moderate' | 'Aggressive';
  onboarded: string;
  status: Status;
}

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

  newSubscriber: any = this.getEmptySubscriber();

  subscribers: Subscriber[] = [
    { id: 'SUB-200', name: 'Ridgeview Capital #1', aum: 250000, risk: 'Conservative', onboarded: '3h ago', status: 'ACTIVE' },
    { id: 'SUB-201', name: 'Northwind Family Office #2', aum: 387311, risk: 'Moderate', onboarded: '11d ago', status: 'ACTIVE' },
    { id: 'SUB-202', name: 'Helix Pensions #3', aum: 524622, risk: 'Aggressive', onboarded: '22d ago', status: 'ACTIVE' },
    { id: 'SUB-203', name: 'Atlas Endowment #4', aum: 661933, risk: 'Conservative', onboarded: '33d ago', status: 'ACTIVE' },
    { id: 'SUB-204', name: 'Beacon Trust #5', aum: 799244, risk: 'Moderate', onboarded: '44d ago', status: 'PAUSED' },
    { id: 'SUB-205', name: 'Coastline Wealth #6', aum: 936555, risk: 'Aggressive', onboarded: '55d ago', status: 'EXITED' },
    { id: 'SUB-206', name: 'Ridgeview Capital #7', aum: 1073866, risk: 'Conservative', onboarded: '66d ago', status: 'ACTIVE' },
    { id: 'SUB-207', name: 'Northwind Family Office #8', aum: 1211177, risk: 'Moderate', onboarded: '77d ago', status: 'ACTIVE' },
    { id: 'SUB-208', name: 'Helix Pensions #9', aum: 1348488, risk: 'Aggressive', onboarded: '88d ago', status: 'ACTIVE' },
    { id: 'SUB-209', name: 'Atlas Endowment #10', aum: 1485799, risk: 'Conservative', onboarded: '99d ago', status: 'ACTIVE' },
    { id: 'SUB-210', name: 'Beacon Trust #11', aum: 1623110, risk: 'Moderate', onboarded: '110d ago', status: 'PAUSED' },
    { id: 'SUB-211', name: 'Coastline Wealth #12', aum: 1760421, risk: 'Aggressive', onboarded: '121d ago', status: 'EXITED' },
  ];

  get filteredSubscribers() {
    return this.subscribers.filter(s => {
      const search = this.searchText.toLowerCase();

      const searchMatch =
        s.id.toLowerCase().includes(search) ||
        s.name.toLowerCase().includes(search);

      const statusMatch =
        this.selectedStatus === 'ALL' ||
        s.status === this.selectedStatus;

      const riskMatch =
        this.selectedRisk === 'ALL' ||
        s.risk === this.selectedRisk;

      return searchMatch && statusMatch && riskMatch;
    });
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
}