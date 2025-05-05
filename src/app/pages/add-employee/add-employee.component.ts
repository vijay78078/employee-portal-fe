import { Component } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatButtonModule, MatFormFieldModule, MatSnackBarModule],
})
export class AddEmployeeComponent {

  employeeForm!: FormGroup;

  employee: any = {
      Employment_Type: '',
      Billable_Status: '',
      Employee_Status: '',
      System_ID: '',
      Bensl_ID: '',
      Full_Name: '',
      Role: '',
      Skill: '',
      Team: '',
      Manager_Name: '',
      Manager_ID: '',
      Critical: '',
      DOJ_Allianz: '',
      DOL_Allianz: '',
      Grade: '',
      Designation: '',
      DOJ_Project: '',
      DOL_Project: '',
      Gender: '',
      Company: '',
      Emailid: '',
      Location: '',
      BillingRate: '',
      Rate_Card: '',
      Remarks: ''
  };

  constructor(private employeeService: EmployeeService, private router: Router, private fb: FormBuilder, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      Employment_Type: ['', Validators.required],
      Billable_Status: ['', Validators.required],
      Employee_Status: ['', Validators.required],
      SystemID: ['', Validators.required],
      BenslID: ['', Validators.required],
      Full_Name: ['', Validators.required],
      Role: ['', Validators.required],
      Skill: ['', Validators.required],
      Team: ['', Validators.required],
      Manager_Name: ['', Validators.required],
      Manager_ID: ['', Validators.required],
      Critical: ['', Validators.required],
      DOJ_Allianz: ['', Validators.required],
      DOL_Allianz: ['', Validators.required],
      Grade: ['', Validators.required],
      Designation: ['', Validators.required],
      DOJ_Project: ['', Validators.required],
      DOL_Project: ['', Validators.required],
      Gender: ['', Validators.required],
      Company: ['', Validators.required],
      Emailid: ['', [Validators.required, Validators.email]],
      Location: ['', Validators.required],
      BillingRate: ['', Validators.required],
      Rate_Card: ['', Validators.required],
      Remarks: ['', Validators.required]
    });
  }

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
      { label: 'Grade', controlName: 'Grade', type: 'select', options: ['AGS5', 'AGS6', 'AGS7', 'AGS8', 'AGS9', 'AGS10', 'AGS11', 'AGS12'] },
      { label: 'Designation', controlName: 'Designation', type: 'text' }
    ],
    [
      { label: 'DOJ Project', controlName: 'DOJ_Project', type: 'date' },
      { label: 'DOL Project', controlName: 'DOL_Project', type: 'date' },
      { label: 'Gender', controlName: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'] },
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

  onSubmit() {
    this.employeeService.addEmployee(this.employee).subscribe({
      next: (res) => {
        
        
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
      error: (err) => {

        const errorToastEl = document.getElementById('employeeErrorToast');
        if (errorToastEl) {
          const errorToast = new bootstrap.Toast(errorToastEl);
          errorToast.show();
        }
      }
    });
  }
  
  
}
