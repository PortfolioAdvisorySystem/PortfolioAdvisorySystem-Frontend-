import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth } from '../services/auth';   
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  constructor(private router: Router, private auth: Auth) {}

  onSubmit(form: any) {

    if (form.invalid) {
      Object.values(form.controls).forEach((control: any) => {
        control.markAsTouched();
      });
      alert("Please enter valid credentials");
      return;
    }

    const payload = {
      email: form.value.email,     
      password: form.value.password
    };

    this.auth.login(payload).subscribe({
      next: () => {

        if (this.auth.isAdmin()) {
          this.router.navigate(['/admin/dashboard']);
        } 
        else if (this.auth.isSubscriber()) {
          this.router.navigate(['/portfolio']);
        } 
        else {
          alert('Unknown role');
        }
      },

      error: (err) => {
        console.error(err);
        alert('Invalid credentials');
      }
    });
  }
}