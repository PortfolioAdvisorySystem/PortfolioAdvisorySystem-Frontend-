import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

/* required for ngModel + *ngIf */
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  constructor(private router: Router) {}

  onSubmit(form: any) {
    if (form.invalid) {
      Object.values(form.controls).forEach((control: any) => {
        control.markAsTouched();
      });

      alert("Please enter valid credentials");
      return;
    }

    this.router.navigate(['/home']);
  }
}