import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}