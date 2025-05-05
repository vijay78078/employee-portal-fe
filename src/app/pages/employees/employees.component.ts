import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { Table, TableModule } from 'primeng/table'; 
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, TableModule, ButtonModule],
})
export class EmployeesComponent implements OnInit {
  @ViewChild('table') table!: Table;
  employees: any[] = [];
  pageSize: number = 8;
  selectedEmployee: any = null;
  totalEmployees: number = 0;

  constructor(private employeeService: EmployeeService, private router: Router) {}

  ngOnInit(): void {
    this.getEmployees();
  }

  first = 0;

onPageChange(event: any) {
  this.first = event.first;
}

  onGlobalFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    this.table?.filterGlobal(value, 'contains');
  }

  
  getEmployees(): void {
    this.employeeService.getEmployees().subscribe(
      (data: any[]) => {
        this.employees = data;
        this.totalEmployees = data.length;
        sessionStorage.setItem('totalEmployees', this.totalEmployees.toString());
      },
      (error) => {
        console.error('Error fetching employee data!', error);
      }
    );
  }

  editEmployee(employee: any) {
    this.router.navigate(['/edit-employee'], {
      state: { employee } // pass employee data through router state
    });
  }

  viewEmployee(employee: any) {
    this.router.navigate(['/view-employee'], {
      state: { employee } // pass employee data through router state
    });
  }

  confirmDelete(employee: any): void {
    this.selectedEmployee = employee;
    const modal = new bootstrap.Modal(document.getElementById('deleteEmployeeModal')!);
    modal.show();
  }
  
  deleteEmployee(): void {
    if (!this.selectedEmployee) return;
  
    console.log('Deleting employee:', this.selectedEmployee.id);
    
    this.employeeService.deleteEmployee(this.selectedEmployee.id).subscribe({
      next: () => {
        // Remove from local list
        this.employees = this.employees.filter(e => e.id !== this.selectedEmployee.id);
  
        const toastEl = document.getElementById('deleteSuccessToast');
        if (toastEl) {
          const toast = new bootstrap.Toast(toastEl);
          toast.show();
        }
  
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteEmployeeModal')!);
        modal?.hide();
      },
      error: (err) => {
        console.error('Delete error:', err);
        const toastEl = document.getElementById('deleteErrorToast');
        if (toastEl) {
          const toast = new bootstrap.Toast(toastEl);
          toast.show();
        }
      }
    });
  }
}
