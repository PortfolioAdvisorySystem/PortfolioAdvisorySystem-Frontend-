import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Auth } from '../services/auth';
import { RegisterRequest } from '../models/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {

  isSubmitted = false;
  loading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private auth: Auth
  ) {}

  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      if (this.auth.isAdmin()) {
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.router.navigate(['/portfolio']);
      }
    }
  }

  onSubmit(form: NgForm) {

    this.isSubmitted = true;
    this.errorMessage = '';

    if (form.invalid) {
      return;
    }

    this.loading = true;
    const payload: RegisterRequest = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      password: form.value.password,
      role: 'SUBSCRIBER'   
    };

    this.auth.register(payload).subscribe({

      next: () => {
        this.loading = false;
        if (this.auth.isAdmin()) {
          this.router.navigate(['/admin/dashboard']);
        } else if (this.auth.isSubscriber()) {
          this.router.navigate(['/questions']);
        } else {
          this.router.navigate(['/login']);
        }
      },

      error: (err) => {

        console.error('Register error:', err);

        this.loading = false;
        if (err.status === 400) {
          this.errorMessage = 'Invalid data. Please check inputs.';
        } else if (err.status === 409) {
          this.errorMessage = 'Email already exists.';
        } else {
          this.errorMessage = 'Registration failed. Try again.';
        }
      }

    });
  }
}