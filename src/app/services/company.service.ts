import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Company } from '../models/company.model';
import { BackendService } from './backend.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private endpoint = 'Company';

  constructor(private backendService: BackendService) { }

  getCompanies(): Observable<Company[]> {
    return this.backendService.get<Company[]>(this.endpoint);
  }
}