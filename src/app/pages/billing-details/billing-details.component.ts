import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { ButtonModule } from 'primeng/button';
import { Table, TableModule } from 'primeng/table';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-billing-details',
  imports: [CommonModule, NgxPaginationModule, TableModule, ButtonModule],
  templateUrl: './billing-details.component.html',
  styleUrl: './billing-details.component.scss'
})
export class BillingDetailsComponent {

  @ViewChild('table') table!: Table;
  employees: any[] = [];
  pageSize: number = 10;
  first = 0;

  constructor(private employeeService: EmployeeService) {}

  onPageChange(event: any) {
    this.first = event.first;
  }

  ngOnInit(): void {
    this.getEmployees();
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
      },
      (error) => {
        console.error('Error fetching employee data!', error);
      }
    );
  }

}
