import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild } from '@angular/core';
import { FeedbackService } from '../../services/feedback.service'; // Your feedback service
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { Table, TableModule } from 'primeng/table';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import * as bootstrap from 'bootstrap';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ErrorStateMatcher, MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { GeminiService } from '../../services/gemini.service';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
  imports: [CommonModule, FormsModule, NgxPaginationModule, TableModule, RatingModule, ButtonModule, InputTextModule, ReactiveFormsModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatNativeDateModule, MatSelectModule,
     SelectModule, DatePickerModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FeedbackComponent implements OnInit {
  @ViewChild('table') table!: Table;

  feedbackForm!: FormGroup;
  formSubmitted = false;
  isRephrasing = false;


  reportees: any[] = []; // For storing employees (for selecting reportees)
  feedbacks: any[] = []; // To store feedbacks (as plain objects)
  selectedReportee: any; // Store the selected employee
  pageSize: number = 5; // Items per page
  newFeedback: any = { rating: 0, feedbackText: '' }; // Initialize with default rating value


  constructor(private feedbackService: FeedbackService, private fb: FormBuilder, private geminiService: GeminiService) { }

  ngOnInit(): void {

    this.feedbackForm = this.fb.group({
      selectedReportee: [null],
      rating: [0],
      date: [null],
      medium: [''],
      quarter: [''],
      year: [''],
      feedbackText: [''],
    });

    this.fetchReportees(); // Fetch employees to display for feedback
    this.fetchFeedbacks(); // Fetch existing feedbacks
  }

  onGlobalFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    this.table?.filterGlobal(value, 'contains');
  }

  rephraseFeedback() {
    const originalText = this.feedbackForm.get('feedbackText')?.value;
  
    if (!originalText || originalText.trim() === '') {
      this.showToast('feedbackErrorToast');
      return;
    }
  
    this.isRephrasing = true;
  
    this.geminiService.rephraseText(originalText).subscribe({
      next: (res) => {
        console.log("res",res.rephrasedText);
        
        this.feedbackForm.patchValue({ feedbackText: res.rephrasedText });
        this.isRephrasing = false;
      },
      error: () => {
        this.showToast('feedbackErrorToast');
        this.isRephrasing = false;
      }
    });
  }

  fetchReportees(): void {
    const managerName = sessionStorage.getItem('managerName') || '';
    this.feedbackService.getReportees(managerName).subscribe(
      (response) => {
        this.reportees = response;
        console.log("this.reportees", this.reportees);
        
      },
      (error) => {
        console.error('Error fetching reportees:', error);
      }
    );
  }

  // Fetch all feedbacks (or you can filter by manager/employee)
  fetchFeedbacks() {
    const userrole = sessionStorage.getItem('role') || '';
    if(userrole!=='M Grade Manager'){
      const managerName = sessionStorage.getItem('managerName') || '';
      this.feedbackService.getAllFeedbacks().subscribe(data => {
        // Filter feedbacks where the managerName matches the logged-in manager
        this.feedbacks = data.filter((feedback: any) => feedback.managerName === managerName);
      });
    }
    else {
      this.feedbackService.getAllFeedbacks().subscribe(data => {
        this.feedbacks = data;
      });
    }
  }
  

  onRatingChange(newRating: number) {
    console.log('Rating changed:', newRating);
    this.newFeedback.rating = newRating;
    console.log('Updated Rating:', this.newFeedback.rating);
  }

  // Submit feedback

  // submitFeedback() {
  //   console.log('Submitting feedback...');
  //   console.log('Selected Reportee:', this.selectedReportee);
  //   console.log('New Feedback:', this.newFeedback);


  //     this.newFeedback.employeeName = this.selectedReportee; // Directly use string for employee name
  //     this.newFeedback.managerName = sessionStorage.getItem('managerName') || ''; // Fetch managerName from session

  //     this.feedbackService.addFeedback(this.newFeedback).subscribe(response => {
  //       console.log("Feedback submitted successfully", response);
  //       this.newFeedback = { rating: 0, feedbackText: '' }; // Reset form
  //       this.selectedReportee = null; // Reset selected reportee
  //       this.fetchFeedbacks(); // Refresh feedback list
  //     }, error => {
  //       console.error('Error submitting feedback', error); // Log any errors
  //     });
  // }

  // submitFeedback() {
  //   // if (
  //   //   this.selectedReportee &&
  //   //   this.newFeedback.rating &&
  //   //   this.newFeedback.feedbackText &&
  //   //   this.newFeedback.date &&
  //   //   this.newFeedback.medium
  //   // ) {
  //   //   const feedback = {
  //   //     employeeName: this.selectedReportee,
  //   //     managerName: sessionStorage.getItem('managerName') || '',
  //   //     rating: this.newFeedback.rating,
  //   //     feedbackText: this.newFeedback.feedbackText,
  //   //     date: this.newFeedback.date,
  //   //     medium: this.newFeedback.medium
  //   //   };
  
  //   //   this.feedbackService.addFeedback(feedback).subscribe({
  //   //     next: (res) => {
  //   //       // Optionally update local feedback list
  //   //       this.feedbacks = [...this.feedbacks, res];
  
  //   //       // Reset the form
  //   //       this.newFeedback = {
  //   //         rating: null,
  //   //         feedbackText: '',
  //   //         date: '',
  //   //         medium: ''
  //   //       };
  //   //       this.selectedReportee = null;
  
  //   //       // Show success toast
  //   //       const successToastEl = document.getElementById('feedbackSuccessToast');
  //   //       if (successToastEl) {
  //   //         const successToast = new bootstrap.Toast(successToastEl);
  //   //         successToast.show();
  //   //       }
  //   //     },
  //   //     error: (err) => {
  //   //       // Show error toast
  //   //       const errorToastEl = document.getElementById('feedbackErrorToast');
  //   //       if (errorToastEl) {
  //   //         const errorToast = new bootstrap.Toast(errorToastEl);
  //   //         errorToast.show();
  //   //       }
  //   //     }
  //   //   });
  //   // } else {
  //   //   // Show error toast (incomplete form)
  //   //   const errorToastEl = document.getElementById('feedbackErrorToast');
  //   //   if (errorToastEl) {
  //   //     const errorToast = new bootstrap.Toast(errorToastEl);
  //   //     errorToast.show();
  //   //   }
  //   // }

  //   this.formSubmitted = true;
  //   const formValues = this.feedbackForm.value;
  //   let feedback = {
  //     employeeName: formValues.selectedReportee,
  //     managerName: sessionStorage.getItem('managerName') || '',
  //     rating: formValues.rating,
  //     feedbackText: formValues.feedbackText,
  //     date: formValues.date,
  //     medium: formValues.medium
  //   };

  //   if (feedback.employeeName && feedback.rating && feedback.feedbackText && feedback.date && feedback.medium) {
     
  //     this.feedbackService.addFeedback(feedback).subscribe({
  //       next: (res) => {
  //         this.feedbacks = [...this.feedbacks, res];
  //         this.feedbackForm.reset(); // Reset reactive form
  //         this.formSubmitted = false;
  
  //         const successToastEl = document.getElementById('feedbackSuccessToast');
  //         if (successToastEl) {
  //           const successToast = new bootstrap.Toast(successToastEl);
  //           successToast.show();
  //         }
  //       },
  //       error: () => {
  //         const errorToastEl = document.getElementById('feedbackErrorToast');
  //         if (errorToastEl) {
  //           const errorToast = new bootstrap.Toast(errorToastEl);
  //           errorToast.show();
  //         }
  //       }
  //     });
  //   } else {
  //     // const errorToastEl = document.getElementById('feedbackErrorToast');
  //     // if (errorToastEl) {
  //     //   const errorToast = new bootstrap.Toast(errorToastEl);
  //     //   errorToast.show();
  //     // }
  //   }

  // }

  submitFeedback() {
    this.formSubmitted = true;
  
    if (this.feedbackForm.invalid) {
      this.showToast('feedbackErrorToast');
      return;
    }
  
    const formValues = this.feedbackForm.value;
  
    // Call your Rephrase API before submitting
    // this.geminiService.rephraseText(formValues.feedbackText).subscribe({
      // next: (res) => {
        // const rephrasedText = res.rephrasedText;
  
        const feedback = {
          employeeName: formValues.selectedReportee,
          managerName: sessionStorage.getItem('managerName') || '',
          rating: formValues.rating,
          feedbackText: formValues.feedbackText, // Use rephrased text
          date: formValues.date,
          medium: formValues.medium,
        };
  
        if(feedback.employeeName && feedback.rating && feedback.feedbackText && feedback.date && feedback.medium) {
        this.feedbackService.addFeedback(feedback).subscribe({
          next: () => {
            this.showToast('feedbackSuccessToast');
            this.feedbackForm.reset();
            this.formSubmitted = false;
            this.fetchFeedbacks();
          },
          error: () => {
            this.showToast('feedbackErrorToast');
          }
        });
      }
      }
      // error: () => {
        // this.showToast('feedbackErrorToast');
      // }
    // });
  

    showToast(toastId: string) {
    const toastEl = document.getElementById(toastId);
    if (toastEl) {
      const toast = new bootstrap.Toast(toastEl);
      toast.show();
    }
  }
  
  
}
