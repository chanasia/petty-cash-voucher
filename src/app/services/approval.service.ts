import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApprovalDto, Approval } from '../models/approval.model';
import { BackendService } from './backend.service';

@Injectable({
  providedIn: 'root'
})
export class ApprovalService {
  private endpoint = 'Approval';

  constructor(private backendService: BackendService) { }

  getApprovalsByVoucherId(voucherId: number): Observable<ApprovalDto[]> {
    return this.backendService.getByParentId<ApprovalDto[]>(this.endpoint, 'voucher', voucherId);
  }

  approveVoucher(approval: Approval): Observable<ApprovalDto> {
    return this.backendService.post<ApprovalDto>(this.endpoint, approval);
  }

  updateApproval(id: number, approval: Approval): Observable<any> {
    return this.backendService.put(this.endpoint, id, approval);
  }
}