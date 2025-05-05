import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-employee',
  imports: [FormsModule, ReactiveFormsModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatButtonModule, MatFormFieldModule, MatSnackBarModule, CommonModule],
  templateUrl: './view-employee.component.html',
  styleUrl: './view-employee.component.scss',
})
export class ViewEmployeeComponent implements OnInit {

  employee: any = {};
  employeeForm!: FormGroup;
  
  constructor(
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const nav = history.state;
    if (nav && nav.employee) {
      this.employeeForm = this.fb.group({
        Employment_Type: [{ value: nav.employee.Employment_Type, disabled: true }],
        Billable_Status: [{ value: nav.employee.Billable_Status, disabled: true }],
        Employee_Status: [{ value: nav.employee.Employee_Status, disabled: true }],
        SystemID: [{ value: nav.employee.System_ID, disabled: true }],
        BenslID: [{ value: nav.employee.Bensl_ID, disabled: true }],
        Full_Name: [{ value: nav.employee.Full_Name, disabled: true }],
        Role: [{ value: nav.employee.Role, disabled: true }],
        Skill: [{ value: nav.employee.Skill, disabled: true }],
        Team: [{ value: nav.employee.Team, disabled: true }],
        Manager_Name: [{ value: nav.employee.Manager_Name, disabled: true }],
        Manager_ID: [{ value: nav.employee.Manager_ID, disabled: true }],
        Critical: [{ value: nav.employee.Critical, disabled: true }],
        DOJ_Allianz: [{ value: nav.employee.DOJ_Allianz, disabled: true }],
        DOL_Allianz: [{ value: nav.employee.DOL_Allianz, disabled: true }],
        Grade: [{ value: nav.employee.Grade, disabled: true }],
        Designation: [{ value: nav.employee.Designation, disabled: true }],
        DOJ_Project: [{ value: nav.employee.DOJ_Project, disabled: true }],
        DOL_Project: [{ value: nav.employee.DOL_Project, disabled: true }],
        Gender: [{ value: nav.employee.Gender, disabled: true }],
        Company: [{ value: nav.employee.Company, disabled: true }],
        Emailid: [{ value: nav.employee.Emailid, disabled: true }],
        Location: [{ value: nav.employee.Location, disabled: true }],
        BillingRate: [{ value: nav.employee.BillingRate, disabled: true }],
        Rate_Card: [{ value: nav.employee.Rate_Card, disabled: true }],
        Remarks: [{ value: nav.employee.Remarks, disabled: true }]
      });
    } else {
      this.router.navigate(['/employees']);
    }
  }

}
