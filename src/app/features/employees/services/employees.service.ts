import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee, EmployeeResponse, SingleEmployeeResponse } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  private readonly API_URL = 'https://69373625f8dc350aff33ae81.mockapi.io/api/v1';

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/employees`);
  }

  getEmployee(id: number): Observable<SingleEmployeeResponse> {
    return this.http.get<SingleEmployeeResponse>(`${this.API_URL}/employee/${id}`);
  }

  createEmployee(employee: Partial<Employee>): Observable<SingleEmployeeResponse> {
    return this.http.post<SingleEmployeeResponse>(`${this.API_URL}/employees`, employee);
  }

  updateEmployee(id: number, employee: Partial<Employee>): Observable<SingleEmployeeResponse> {
    return this.http.put<SingleEmployeeResponse>(`${this.API_URL}/employees/${id}`, employee);
  }

  deleteEmployee(id: number): Observable<SingleEmployeeResponse> {
    return this.http.delete<SingleEmployeeResponse>(`${this.API_URL}/employees/${id}`);
  }
}
