import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [CommonModule, RouterModule]
})
export class NavbarComponent {

  manager: string = "";
  constructor(public router: Router) {}

  menuItems = [
    { label: 'Dashboard', route: '/dashboard', icon: 'fas fa-tachometer-alt', action: () => this.navigateToDashboard() },
    { label: 'Employees', route: '/employees', icon: 'fas fa-users', action: () => this.navigateToEmployees() },
    { label: 'Employee Feedback', route: '/feedback', icon: 'fas fa-comments', action: () => this.navigateToFeedback() },
    { label: 'Billing Details', route: '/billing-details', icon: 'fa fa-file-invoice-dollar', action: () => this.navigateToBillingDetails() },
    { label: 'Profile', route: '/profile', icon: 'fas fa-user-circle', action: () => this.navigateToProfile() },
    { label: 'Import/Export', route: '/import-export', icon: 'fas fa-file-import', action: () => this.navigateToImportExport() },
    // { label: 'Hierarchy Tree', route: '/hierarchy-tree', icon: 'fas fa-file-import', action: () => this.navigateToHierarchyTree() },
    { label: 'Logout', route: '/login', icon: 'fas fa-sign-out-alt', action: () => this.logout() }
  ];
  
  ngOnInit(){
    this.manager = sessionStorage.getItem('managerName') || '';
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  navigateToImportExport(){
    this.router.navigate(['/import-export']);    
  }

  navigateToEmployees(){
    this.router.navigate(['/employees']);    
  }

  navigateToDashboard(){
    this.router.navigate(['/dashboard']);    
  }

  navigateToFeedback(){
    this.router.navigate(['/feedback']);    
  }

  navigateToProfile(){
    this.router.navigate(['/profile']);  
  }

  navigateToBillingDetails(){
    this.router.navigate(['/billing-details']);  
  }

  navigateToHierarchyTree(){
    this.router.navigate(['/hierarchy-tree']);  
  }

}
