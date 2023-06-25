import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class DataService {
  private apiUrl = 'http://localhost:8000/api'; // آدرس API سرور

  constructor(private http: HttpClient) { }

  saveData(data: any): Observable<any> {
    const url = `${this.apiUrl}/scores`;
    return this.http.post(url, data);
  }
  

  getDataList(): Observable<any[]> {
    const url = `${this.apiUrl}/scores`;
    return this.http.get<any[]>(url);
  }
}
