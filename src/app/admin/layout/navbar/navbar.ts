import { Component , EventEmitter, Output } from '@angular/core';
import { Auth } from '../../../services/auth';
@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  @Output() toggleSidebar = new EventEmitter<void>();

  onToggle() {
    this.toggleSidebar.emit();
  }
  constructor(public auth: Auth) {} 
  logout() {
  this.auth.logout();  
}
}