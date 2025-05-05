import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Chart, ChartData, ChartOptions } from 'chart.js';
import { PieController, ArcElement, Tooltip, Legend } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { EmployeeService } from '../../services/employee.service';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import * as bootstrap from 'bootstrap';
import { FeedbackService } from '../../services/feedback.service';
import { TableModule } from 'primeng/table';



Chart.register(PieController, ArcElement, Tooltip, Legend);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: true,
  imports: [NgChartsModule, CommonModule, TableModule]
})
export class DashboardComponent {

  file: File | null = null;
  columns: string[] = [];
  employees: any[] = [];
  totalEmployees: number = 0;
  reporteesCount: number = 0;
  feedbacks: any[] = [];
  feedbackCount: number = 0;

  pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#FF33B2', '#FFB233','#FFB2C3']
    }]
  };

  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => {
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
          }
        }
      }
    }
  };

  billableChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [{
      data: [],  // Replace with actual data from API
      backgroundColor: ['#4CAF50', '#FF5733']
    }]
  };

  employmentTypeChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [{
      data: [],  // Replace with actual data from API
      backgroundColor: ['#2196F3', '#FFC107']
    }]
  };

  teamChartData: ChartData<'pie'> = {
    labels: [],  // Add team names dynamically
    datasets: [{
      data: [],  // Replace with actual data from API
      backgroundColor: ['#FF6347', '#FFD700', '#32CD32']
    }]
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private employeeService: EmployeeService,
    private feedbackService: FeedbackService
  ) {}

  ngOnInit(): void {
    this.getEmployees();
    this.fetchReportees();
    this.fetchFeedbacks();
  }

  getEmployees(): void {
    this.employeeService.getEmployees().subscribe(
      (data: any[]) => {
        this.employees = data;
        this.totalEmployees = data.length;
        this.updateSkillDistribution();
      },
      error => console.error('Error fetching employee data', error)
    );
  }

  fetchReportees(): void {
    const managerName = sessionStorage.getItem('managerName') || '';
    this.feedbackService.getReportees(managerName).subscribe(
      (response) => {
        this.reporteesCount = response.length;
      },
      (error) => {
        console.error('Error fetching reportees:', error);
      }
    );
  }

  fetchFeedbacks() {
    const userrole = sessionStorage.getItem('role') || '';
    if(userrole!=='M_Grade_Manager'){
      const managerName = sessionStorage.getItem('managerName') || '';
      this.feedbackService.getAllFeedbacks().subscribe(data => {
        // Filter feedbacks where the managerName matches the logged-in manager
        this.feedbacks = data.filter((feedback: any) => feedback.managerName === managerName);
        this.feedbackCount = this.feedbacks.length;
        console.log("Feedbacks for manager:", this.feedbackCount);
        
      });
    }
    else {
      this.feedbackService.getAllFeedbacks().subscribe(data => {
        this.feedbacks = data;
        this.feedbackCount = this.feedbacks.length;
        console.log("Feedbacks for line manager:", this.feedbackCount);
      });
    }
  }

  updateSkillDistribution(): void {
    const skills = this.extractSkills(this.employees);
    const skillCounts = this.calculateSkillDistribution(skills);

    // Assign a new object to trigger change detection
    this.pieChartData = {
      labels: Object.keys(skillCounts),
      datasets: [{
        data: Object.values(skillCounts),
        backgroundColor: ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#FF33B2', '#FFB233','#FFB2C3']
      }]
    };
  }

  extractSkills(employees: any[]): string[] {
    let skills: string[] = [];
    employees.forEach(employee => {
      if (employee.Skills && Array.isArray(employee.Skills)) {
        skills = skills.concat(employee.Skills.map((s: string) => s.trim()));
      } else if (typeof employee.Skill === 'string') {
        skills.push(employee.Skill.trim());
      }
    });
    return skills;
  }

  calculateSkillDistribution(skills: string[]): { [key: string]: number } {
    const skillCounts: { [key: string]: number } = {};
    skills.forEach(skill => {
      skillCounts[skill] = (skillCounts[skill] || 0) + 1;
    });
    return skillCounts;
  }


  goToEmployees() {
    this.router.navigate(['/employees']);
  }

  goToFeedback() {
    this.router.navigate(['/feedback']);
  }

  navigateToAddEmployee(){
    this.router.navigate(['/add-employee']);
  }

  navigateToEmployees(){
    this.router.navigate(['/employees']);
  }

  onFileChange(event: any): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length) {
      const selectedFile = target.files[0];
      const validTypes = ['csv', 'xls', 'xlsx'];
  
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
      if (fileExtension && validTypes.includes(fileExtension)) {
        this.file = selectedFile;
      } else {
        this.file = null;
        // Show an error toast or alert
        const errorToastEl = document.getElementById('fileTypeErrorToast');
        if (errorToastEl) {
          const errorToast = new bootstrap.Toast(errorToastEl);
          errorToast.show();
        }
      }
    }

    this.onImport(new Event('submit'));
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


    
    
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
