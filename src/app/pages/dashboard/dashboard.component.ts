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
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';



Chart.register(PieController, ArcElement, Tooltip, Legend);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: true,
  imports: [NgChartsModule, CommonModule, TableModule, FormsModule, MatFormFieldModule,
    MatSelectModule,MatButtonModule, MatButtonToggleModule],
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {

  
  file: File | null = null;
  columns: string[] = [];
  employees: any[] = [];
  totalEmployees: number = 0;
  reporteesCount: number = 0;
  feedbacks: any[] = [];
  feedbackCount: number = 0;
  selectedChart: string = 'skill';

  pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#FF33B2', '#FFB233', '#FFB2C3', '#FF6347', '#FFD700', '#32CD32', '#8A2BE2', '#00CED1']
    }]
  };

  // pieChartOptions: ChartOptions<'pie'> = {
  //   responsive: true,
  //   plugins: {
  //     legend: {
  //       position: 'top',
  //     },
  //     tooltip: {
  //       callbacks: {
  //         label: (tooltipItem: any) => {
  //           return `${tooltipItem.label}: ${tooltipItem.raw}`;
  //         }
  //       }
  //     }
  //   }
  // };

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
  },
  // onClick: (event, elements, chart) => {
  //   if (elements.length > 0) {
  //     const chartElement = elements[0];
  //     const label = chart.data.labels?.[chartElement.index] as string;
  //     this.showPopoverForSegment(label);  // Custom method to trigger popover
  //   }
  // }
};

selectedEmployeesForPopover: any[] = [];
popoverTitle = '';
showPopover = false;

// triggerPopover(index: number): void {
//   const label = this.pieChartData.labels?.[index];
//   if (label) {
//     this.showPopoverForSegment(label as string);
//   }
// }

 private modal: any;

  ngAfterViewInit(): void {
    this.modal = new bootstrap.Modal(document.getElementById('employeeModal')!);
  }

// showPopoverForSegment(label: string): void {
//   this.showPopover = true;
//   this.popoverTitle = label;

//   switch (this.selectedChart) {
//     case 'billable':
//       this.selectedEmployeesForPopover = this.employees.filter(e =>
//         label === 'Billable' ? e.Billable_Status === 'Billable' : e.Billable_Status !== 'Billable'
//       );
//       break;

//     case 'employmentType':
//       this.selectedEmployeesForPopover = this.employees.filter(e => e.Employment_Type === label);
//       break;

//     case 'team':
//       this.selectedEmployeesForPopover = this.employees.filter(e => e.Team === label);
//       break;

//     case 'location':
//       this.selectedEmployeesForPopover = this.employees.filter(e => e.Location === label);
//       break;

//     case 'skill':
//       this.selectedEmployeesForPopover = this.employees.filter(e => {
//         if (Array.isArray(e.Skills)) {
//           return e.Skills.includes(label);
//         } else if (typeof e.Skill === 'string') {
//           return e.Skill.trim() === label;
//         }
//         return false;
//       });
//       break;
//   }
// }


 showPopoverForSegment(label: unknown, index: number, event: MouseEvent): void {
    const labelAsString = String(label);
    this.popoverTitle = labelAsString;
    this.selectedEmployeesForPopover = this.getEmployeesForLabel(labelAsString);
    this.modal.show();
  }

  getEmployeesForLabel(label: string): any[] {
    switch (this.selectedChart) {
      case 'billable':
        return this.employees.filter(e =>
          label === 'Billable' ? e.Billable_Status === 'Billable' : e.Billable_Status !== 'Billable'
        );
      case 'employmentType':
        return this.employees.filter(e => e.Employment_Type === label);
      case 'team':
        return this.employees.filter(e => e.Team === label);
      case 'location':
        return this.employees.filter(e => e.Location === label);
      case 'skill':
        return this.employees.filter(e => {
          if (Array.isArray(e.Skills)) {
            return e.Skills.includes(label);
          } else if (typeof e.Skill === 'string') {
            return e.Skill.trim().toLowerCase() === label.toLowerCase();
          }
          return false;
        });
      default:
        return [];
    }
  }

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

  locationChartData: ChartData<'pie'> = {
  labels: [],
  datasets: [{
    data: [],
    backgroundColor: ['#FF7F50', '#87CEFA']
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

  chartTypes = [
    { label: 'Skill', value: 'skill' },
    { label: 'Billable', value: 'billable' },
    { label: 'Employment Type', value: 'employmentType' },
    { label: 'Team', value: 'team' },
    { label: 'Location', value: 'location' } 
  ];
  

  
  selectChart(type: string) {
    this.selectedChart = type;
    this.updateChart();
  }
  

  getEmployees(): void {
    // this.employeeService.getEmployees().subscribe(
    //   (data: any[]) => {
    //     this.employees = data;
    //     this.totalEmployees = data.length;
    //     this.updateSkillDistribution();
    //   },
    //   error => console.error('Error fetching employee data', error)
    // );

    this.employeeService.getEmployees().subscribe(
      (data: any[]) => {
        this.employees = data;
        this.totalEmployees = data.length;
        this.prepareAllCharts();
      },
      error => console.error('Error fetching employee data', error)
    );

  }

  prepareAllCharts(): void {
    this.updateSkillChart();
    this.updateBillableChart();
    this.updateEmploymentTypeChart();
    this.updateTeamChart();
    this.updateLocationChart();
    this.updateChart(); // initialize first chart
  }
  
  updateChart(): void {
    switch (this.selectedChart) {
      case 'skill':
        this.pieChartData = this.skillChartData;
        break;
      case 'billable':
        this.pieChartData = this.billableChartData;
        break;
      case 'employmentType':
        this.pieChartData = this.employmentTypeChartData;
        break;
      case 'team':
        this.pieChartData = this.teamChartData;
        break;
      case 'location':
      this.pieChartData = this.locationChartData;
      break;
    }
  }
  
  updateSkillChart(): void {
    const skills = this.extractSkills(this.employees);
    const skillCounts = this.calculateSkillDistribution(skills);
    this.skillChartData = {
      labels: Object.keys(skillCounts),
      datasets: [{
        data: Object.values(skillCounts),
        backgroundColor: ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#FF33B2', '#FFB233','#FFB2C3', '#FF6347', '#FFD700', '#32CD32', '#8A2BE2', '#00CED1', '#00FF7F', '#FF4500', '#FF1493', '#1E90FF', '#00FA9A', '#D2691E', '#8B008B', '#B8860B', '#4682B4', '#2E8B57', '#A0522D', '#6A5ACD', '#20B2AA']
      }]
    };
  }
  
  updateBillableChart(): void {
    const billableCounts = { Billable: 0, Non_Billable: 0 };
    this.employees.forEach(e => {
      if (e.Billable_Status === 'Billable') {
        billableCounts.Billable++;
      } else {
        billableCounts.Non_Billable++;
      }
    });
  
    this.billableChartData = {
      labels: ['Billable', 'Non-Billable'],
      datasets: [{
        data: [billableCounts.Billable, billableCounts.Non_Billable],
        backgroundColor: ['#4CAF50', '#FF5733']
      }]
    };
  }
  
  updateEmploymentTypeChart(): void {
    const empTypeCounts = { Permanent: 0, Contract: 0 };
    this.employees.forEach(e => {
      if (e.Employment_Type === 'Permanent') {
        empTypeCounts.Permanent++;
      } else {
        empTypeCounts.Contract++;
      }
    });
  
    this.employmentTypeChartData = {
      labels: ['Permanent', 'Contract'],
      datasets: [{
        data: [empTypeCounts.Permanent, empTypeCounts.Contract],
        backgroundColor: ['#2196F3', '#FFC107']
      }]
    };
  }
  
  updateTeamChart(): void {
    const teamCounts: { [team: string]: number } = {};
    this.employees.forEach(e => {
      const team = e.Team || 'Unknown';
      teamCounts[team] = (teamCounts[team] || 0) + 1;
    });
  
    this.teamChartData = {
      labels: Object.keys(teamCounts),
      datasets: [{
        data: Object.values(teamCounts),
        backgroundColor: ['#FF6347', '#FFD700', '#32CD32', '#8A2BE2', '#00CED1']
      }]
    };
  }
  
  updateLocationChart(): void {
  const locationCounts: { [location: string]: number } = {};

  this.employees.forEach(e => {
    const location = e.Location || 'Unknown';
    locationCounts[location] = (locationCounts[location] || 0) + 1;
  });

  this.locationChartData = {
    labels: Object.keys(locationCounts),
    datasets: [{
      data: Object.values(locationCounts),
      backgroundColor: ['#FF7F50', '#87CEFA']
    }]
  };
}


  skillChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: []
    }]
  };
  

  getBackgroundColor(index: number): string {
    const bgColors = this.pieChartData?.datasets?.[0]?.backgroundColor as string[];
    return bgColors && bgColors[index] ? bgColors[index] : '#ccc'; // fallback to grey
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
    if(userrole!=='M Grade Manager'){
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
