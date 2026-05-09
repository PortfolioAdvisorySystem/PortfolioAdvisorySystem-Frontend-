import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Auth } from '../services/auth';  
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class Sidebar { 
  constructor(private auth: Auth) {}
  logout() {
    this.auth.logout();   
  }
}