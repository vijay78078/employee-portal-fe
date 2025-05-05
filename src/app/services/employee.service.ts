import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private apiUrl = 'http://localhost:8081/api/employees';

  constructor(private http: HttpClient) { }

  // Send employee data to the backend for import (update or insert)
  importEmployees(employees: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/import`, employees);
  }

  // Get employee data (optional for export)
  exportEmployees(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/export`);
  }

  getEmployees(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/employeeslist`);
  }

  addEmployee(employee: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, employee);
  }


  updateEmployee(employee: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/edit/${employee.id}`, employee);
  }

  deleteEmployee(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

}
