import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  private apiUrl = 'http://localhost:8081/api/feedback'; // Backend URL

  constructor(private http: HttpClient) { }

  // Get all feedbacks
  getAllFeedbacks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }

  // Add new feedback
  addFeedback(feedback: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, feedback);
  }

  getReportees(managerName: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/reportees/${managerName}`);
  }

}
