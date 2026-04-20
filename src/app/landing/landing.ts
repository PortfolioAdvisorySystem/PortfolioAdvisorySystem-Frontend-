import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterModule],   // ✅ IMPORTANT
  templateUrl: './landing.html',
  styleUrls: ['./landing.css']
})
export class LandingComponent {}