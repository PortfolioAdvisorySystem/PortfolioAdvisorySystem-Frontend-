import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {

  isSubmitted = false;  // ✅ track submit manually

  constructor(private router: Router) {}

  onSubmit(form: NgForm) {
    this.isSubmitted = true;

    if (form.invalid) {
      return;
    }

    this.router.navigate(['/home']);
  }
}