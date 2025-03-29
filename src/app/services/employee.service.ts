import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee.model';
import { BackendService } from './backend.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private endpoint = 'Employee';

  constructor(private backendService: BackendService) { }

  getEmployees(): Observable<Employee[]> {
    return this.backendService.get<Employee[]>(this.endpoint);
  }
}