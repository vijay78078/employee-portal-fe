import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { EmployeeService } from '../../services/employee.service';
import { CommonModule } from '@angular/common';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-import-export',
  templateUrl: './import-export.component.html',
  styleUrls: ['./import-export.component.css'],
  imports: [CommonModule]
})
export class ImportExportComponent {
  file: File | null = null;
  employees: any[] = [];  // Make sure this is an array
  columns: string[] = [];

  constructor(private employeeService: EmployeeService) {}

  // Handle file change event
  onFileChange(event: any): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length) {
      this.file = target.files[0];
    }
  }

  // Import data from Excel/CSV file
  onImport(event: Event): void {
    if (!this.file) return;
  
    event.preventDefault(); 
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
  
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
  
      this.employees = jsonData;
      this.columns = jsonData.length > 0 ? Object.keys(jsonData[0] as object) : [];
      console.log("Imported employees", this.employees);
  
      this.employeeService.importEmployees(this.employees).subscribe(
        (response) => {
          console.log('Employees imported successfully:', response);
  
          const toastEl = document.getElementById('importSuccessToast');
          if (toastEl) {
            const toast = new bootstrap.Toast(toastEl);
            toast.show();
          }
  
          // Clear file input
          const fileInput = document.getElementById('fileInput') as HTMLInputElement;
          if (fileInput) {
            fileInput.value = '';
          }
          this.file = null;
  
        },
        (error) => {
          console.error('Error importing employees:', error);
  
          const toastEl = document.getElementById('importErrorToast');
          if (toastEl) {
            const toast = new bootstrap.Toast(toastEl);
            toast.show();
          }
        }
      );
    };
  
    reader.readAsArrayBuffer(this.file);
  }
  

  // Export data to Excel
  onExport(): void {
    // Make sure to subscribe to the observable to get the employees array

    this.employeeService.exportEmployees().subscribe(data => {
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Employees');
    
      const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
      FileSaver.saveAs(file, 'employees.xlsx');
    
      const toastEl = document.getElementById('exportSuccessToast');
      if (toastEl) {
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
      }
    }, error => {
      console.error('Error exporting data:', error);
    
      const toastEl = document.getElementById('exportErrorToast');
      if (toastEl) {
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
      }
    });

    
  }
}
