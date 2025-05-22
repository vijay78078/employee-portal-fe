import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private apiUrl = 'http://localhost:8081/api/ai/rephrase'; // Adjust this if you're using a backend proxy

  constructor(private http: HttpClient) {}

  rephraseText(originalText: string): Observable<{ rephrasedText: string }> {
    return this.http.post<{ rephrasedText: string }>(this.apiUrl, { text: originalText });
  }
}
