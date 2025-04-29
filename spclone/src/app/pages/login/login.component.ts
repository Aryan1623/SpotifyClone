import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Define a User interface for type safety
interface User {
  id: string;
  email: string;
  password: string;
  fullName: string; // Full name of the user
}

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule, HttpClientModule],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    const apiUrl = `http://localhost:3000/Users`;

    this.http.get<User[]>(apiUrl).subscribe(
      (users: User[]) => {
        // Find user matching entered email and password
        const matchingUser = users.find(
          user => user.email === this.email && user.password === this.password
        );

        if (matchingUser) {
          // Successful login
          console.log('Login successful:', matchingUser);
          this.errorMessage = '';

          // Extract fullName and id from the user data
          const fullName = matchingUser.fullName; // Fetch full name
          const userId = matchingUser.id; // Fetch user ID
          // Redirect to loginhome with fullName and userId as query parameters
          this.router.navigate(['/loginhome'], {
            queryParams: { username: fullName, userId: userId }
          });
        } else {
          // Handle invalid credentials
          this.errorMessage = 'Invalid email or password';
          console.error('Login failed: Invalid email or password');
        }
      },
      (error: any) => {
        // Handle API errors
        this.errorMessage = 'An error occurred while trying to log in';
        console.error('Login failed:', error);
      }
    );
  }

  showAlert() {
    alert('This feature is not yet added');
  }
}
