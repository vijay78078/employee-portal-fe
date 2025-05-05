import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  // Check if user is logged in by checking localStorage
  isAuthenticated(): boolean {
    return localStorage.getItem('loggedIn') === 'true';
  }

  // When user logs in successfully, call this
  login(): void {
    localStorage.setItem('loggedIn', 'true');
  }

  // When user logs out, call this
  logout(): void {
    localStorage.removeItem('loggedIn');
  }
}
