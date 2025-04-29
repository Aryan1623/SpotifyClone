import { Component } from '@angular/core';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  imports: [CommonModule, FormsModule,HttpClientModule]
})
export class SignupComponent {
  fullName: string = '';
  email: string = '';
  mobileNo: string = '';
  password: string = '';
  confirmPassword: string = '';
  passwordsMatch: boolean = true;

  constructor(private http: HttpClient, private router: Router) {}

  validatePasswords() {
    this.passwordsMatch = this.password === this.confirmPassword;
  }

  signUp() {
    if (!this.passwordsMatch) {
      return;
    }

    const signupData = {
      fullName: this.fullName,
      email: this.email,
      mobileNo: this.mobileNo,
      password: this.password
    };

    this.http.post('http://localhost:3000/Users', signupData)
      .subscribe({
        next: (response: any) => {
          // Handle successful response, e.g., save token and navigate to a different page
          console.log('Sign-up successful:', response);
          this.router.navigate(['/login']);
        },
        error: (error: any) => {
          // Handle error response, e.g., display an error message
          console.error('Sign-up failed:', error);
          alert('Sign-up failed. Please try again.');
        }
      });
  }
}
