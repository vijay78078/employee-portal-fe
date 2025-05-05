import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = 'http://localhost:8081/api/login';

  constructor(private http: HttpClient) {}

  login(loginPayload: { username: string, password: string }): Observable<string> {
    return this.http.post<string>(this.apiUrl, loginPayload);
  }
}
