import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {


  username: string | null = '';
  role: string | null = '';
  fullName: string | null = '';
  emailid: string | null = '';

  ngOnInit(): void {
    this.username = sessionStorage.getItem('managerName');
    this.role = sessionStorage.getItem('role');
    this.fullName = sessionStorage.getItem('fullName');
    this.emailid = sessionStorage.getItem('emailid');
  }
  
}
