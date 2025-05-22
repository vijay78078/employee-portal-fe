import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { EmployeeService } from '../../services/employee.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { format } from 'date-fns';


@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  imports:[FormsModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatButtonModule, MatFormFieldModule, MatSnackBarModule, CommonModule, ReactiveFormsModule],
})
export class EditEmployeeComponent implements OnInit {
  employee: any = {};
  employeeForm!: FormGroup;

  formFieldRows = [
    [
      { label: 'Employment Type', controlName: 'Employment_Type', type: 'select', options: ['Permanent', 'Contract'] },
      { label: 'Billable Status', controlName: 'Billable_Status', type: 'select', options: ['Billable', 'Non Billable'] },
      { label: 'Employee Status', controlName: 'Employee_Status', type: 'select', options: ['ACTIVE', 'INACTIVE'] },
      { label: 'System ID', controlName: 'SystemID', type: 'text' }
    ],
    [
      { label: 'Bensl ID', controlName: 'BenslID', type: 'text' },
      { label: 'Full Name', controlName: 'Full_Name', type: 'text' },
      { label: 'Role', controlName: 'Role', type: 'text' },
      { label: 'Skill', controlName: 'Skill', type: 'text' }
    ],
    [
      { label: 'Team', controlName: 'Team', type: 'select', options: ['UFS', 'RG'] },
      { label: 'Manager Name', controlName: 'Manager_Name', type: 'text' },
      { label: 'Manager ID', controlName: 'Manager_ID', type: 'text' },
      { label: 'Critical', controlName: 'Critical', type: 'text' }
    ],
    [
      { label: 'DOJ Allianz', controlName: 'DOJ_Allianz', type: 'date' },
      { label: 'DOL Allianz', controlName: 'DOL_Allianz', type: 'date' },
      { label: 'Grade', controlName: 'Grade', type: 'select', options: ['AGS 5', 'AGS 6', 'AGS 7', 'AGS 8', 'AGS 9', 'AGS 10', 'AGS 11', 'AGS 12'] },
      { label: 'Designation', controlName: 'Designation', type: 'text' }
    ],
    [
      { label: 'DOJ Project', controlName: 'DOJ_Project', type: 'date' },
      { label: 'DOL Project', controlName: 'DOL_Project', type: 'date' },
      { label: 'Gender', controlName: 'Gender', type: 'select', options: ['M', 'F'] },
      { label: 'Company', controlName: 'Company', type: 'select', options: ['AZTEC', 'Accenture', 'AZ Consulting', 'TCS', 'Infosys', 'Sonyocareers.com'] }
    ],
    [
      { label: 'Email ID', controlName: 'Emailid', type: 'email' },
      { label: 'Location', controlName: 'Location', type: 'select', options: ['TVM', 'Pune'] },
      { label: 'Billing Rate', controlName: 'BillingRate', type: 'text' },
      { label: 'Rate Card', controlName: 'Rate_Card', type: 'text' }
    ],
    [
      { label: 'Remarks', controlName: 'Remarks', type: 'textarea' }
    ]
  ];

  constructor(
    private location: Location,
    private employeeService: EmployeeService,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const nav = history.state;
    if (nav && nav.employee) {
      this.buildForm(nav.employee);
    } else {
      this.router.navigate(['/employees']);
    }
  }

  buildForm(data: any) {
    console.log(data,"data")
    this.employeeForm = this.fb.group({
      id: [data.id], // Assuming the employee object has an 'id' property
      Employment_Type: [data.Employment_Type],
      Billable_Status: [data.Billable_Status],
      Employee_Status: [data.Employee_Status],
      SystemID: [data.System_ID],
      BenslID: [data.Bensl_ID],
      Full_Name: [data.Full_Name, Validators.required],
      Role: [data.Role],
      Skill: [data.Skill],
      Team: [data.Team],
      Manager_Name: [data.Manager_Name],
      Manager_ID: [data.Manager_ID],
      Critical: [data.Critical],
      DOJ_Allianz: [data.DOJ_Allianz],
      DOL_Allianz: [data.DOL_Allianz],
      Grade: [data.Grade],
      Designation: [data.Designation],
      DOJ_Project: [data.DOJ_Project],
      DOL_Project: [data.DOL_Project],
      Gender: [data.Gender],
      Company: [data.Company],
      Emailid: [data.Emailid, [Validators.required, Validators.email]],
      Location: [data.Location],
      BillingRate: [data.BillingRate],
      Rate_Card: [data.Rate_Card],
      Remarks: [data.Remarks]
    });
  }
  
  updateEmployee() {
    
    const formattedDate_DOJ_Allianz = format(new Date(this.employeeForm.value.DOJ_Allianz), 'yyyy-MM-dd');
    this.employeeForm.value.DOJ_Allianz = formattedDate_DOJ_Allianz;

    const formattedDate_DOL_Allianz = format(new Date(this.employeeForm.value.DOL_Allianz), 'yyyy-MM-dd');
    this.employeeForm.value.DOL_Allianz = formattedDate_DOL_Allianz;

    const formattedDate_DOJ_Project = format(new Date(this.employeeForm.value.DOJ_Project), 'yyyy-MM-dd');
    this.employeeForm.value.DOJ_Project = formattedDate_DOJ_Project;

    const formattedDate_DOL_Project = format(new Date(this.employeeForm.value.DOL_Project), 'yyyy-MM-dd');
    this.employeeForm.value.DOL_Project = formattedDate_DOL_Project;


    this.employeeService.updateEmployee(this.employeeForm.value).subscribe({
      next: () => {        
        const successToastEl = document.getElementById('employeeSuccessToast');
        if (successToastEl) {
          const successToast = new bootstrap.Toast(successToastEl);
          successToast.show();
        }
  
        // Navigate after a short delay to allow toast to show
        setTimeout(() => {
          this.router.navigate(['/employees']);
        }, 2000); // 2 seconds delay
      },
      error: () => {
        const errorToastEl = document.getElementById('employeeErrorToast');
        if (errorToastEl) {
          const errorToast = new bootstrap.Toast(errorToastEl);
          errorToast.show();
        }
      }
    });
  }
  

  goBack() {
    this.location.back();
  }
}
