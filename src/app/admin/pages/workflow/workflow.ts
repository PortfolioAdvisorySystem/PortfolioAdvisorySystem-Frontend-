import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


type Status = 'APPROVED' | 'PENDING' | 'REJECTED';

interface Command {
  id: string;
  action: string;
  user: string;
  time: string;
  status: Status;
  payload: any;
  notes: string;
}

@Component({
  selector: 'app-workflow',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './workflow.html',
  styleUrls: ['./workflow.css']
})
export class WorkflowComponent {

  activeTab: 'ALL' | 'PENDING' = 'ALL';

  commands: Command[] = [
    {
      id: 'CMD-9003',
      action: 'REBALANCE_TRIGGER',
      user: 'carol',
      time: '4h ago',
      status: 'PENDING',
      payload: {
        strategies: ['Moderate', 'Aggressive'],
        dryRun: false
      },
      notes: ''
    },
    {
      id: 'CMD-8990',
      action: 'RULE_UPDATE',
      user: 'alice',
      time: '6h ago',
      status: 'APPROVED',
      payload: { id: 'R-1001', threshold: 25 },
      notes: 'Approved — within mandate.'
    },
    {
      id: 'CMD-8987',
      action: 'SUBSCRIBER_INFLOW',
      user: 'bob',
      time: '1d ago',
      status: 'REJECTED',
      payload: { subscriberId: 'SUB-221', amount: 1500000 },
      notes: 'Source of funds not verified.'
    }
  ];

  selectedCommand: Command | null = null;
  isDrawerOpen = false;

  openCommand(cmd: Command) {
    this.selectedCommand = cmd;
    this.isDrawerOpen = true;
  }

  closeDrawer() {
    this.isDrawerOpen = false;
    this.selectedCommand = null;
  }

  get filteredCommands() {
    return this.commands.filter(c =>
      this.activeTab === 'ALL' || c.status === 'PENDING'
    );
  }

  approveCommand() {
    if (!this.selectedCommand) return;

    this.selectedCommand.status = 'APPROVED';
    if (!this.selectedCommand.notes) {
      this.selectedCommand.notes = 'Approved — within mandate.';
    }
  }

  rejectCommand() {
    if (!this.selectedCommand) return;

    this.selectedCommand.status = 'REJECTED';

    if (!this.selectedCommand.notes) {
      this.selectedCommand.notes = 'Rejected by reviewer.';
    }
  }
}