// import { CommonModule } from '@angular/common';
// import { Component } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import { LoginService } from '../../services/login.service';
// import { AuthService } from '../../services/auth.service';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   imports: [FormsModule, CommonModule],
// })
// export class LoginComponent {
//   username = '';
//   password = '';
//   errorMessage = '';

//   constructor(private router: Router, private loginService: LoginService, private authService: AuthService) {}

//   login() {
 
//     const loginPayload = {
//       username: this.username,  
//       password: this.password
//     };


//     this.loginService.login(loginPayload).subscribe({
//       next: (response: any) => {
//         console.log(response);
//         if (response){
//           this.authService.login();
//           sessionStorage.setItem('managerName', this.username);
//           sessionStorage.setItem('role', response.role);
//           sessionStorage.setItem('fullName', response.fullName);
//           sessionStorage.setItem('emailid', response.emailid);
//           this.router.navigate(['/dashboard']);
//         }
//       },
//       error: (error) => {
//         console.error(error);
//         this.errorMessage = 'Invalid username or password';
//       }
//     });
//   }
// }



import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.invalid) return;

    const { username, password } = this.loginForm.value;

    const loginPayload = { username, password };

    this.loginService.login(loginPayload).subscribe({
      next: (response: any) => {
        if (response) {
          this.authService.login();
          sessionStorage.setItem('managerName', username);
          sessionStorage.setItem('role', response.role);
          sessionStorage.setItem('fullName', response.fullName);
          sessionStorage.setItem('emailid', response.emailid);
          this.router.navigate(['/dashboard']);
        }
      },
      error: () => {
        this.errorMessage = 'Invalid username or password';
      }
    });
  }
}

