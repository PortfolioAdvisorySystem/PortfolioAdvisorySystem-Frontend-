import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {

  subscriberEmail = localStorage.getItem('email') || 'Your Investment Dashboard';

  getInitials(): string {
    const email = this.subscriberEmail;

    if (!email || email === 'Your Investment Dashboard') return 'U';

    return email
      .split('@')[0]
      .split(/[._]/)
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  }
}
