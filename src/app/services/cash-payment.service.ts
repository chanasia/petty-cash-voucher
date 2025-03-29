import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CashPayment, CashPaymentDto } from '../models/cash-payment.model';
import { BackendService } from './backend.service';

@Injectable({
  providedIn: 'root'
})
export class CashPaymentService {
  private endpoint = 'CashPayment';

  constructor(private backendService: BackendService) { }

  getCashPayments(): Observable<CashPaymentDto[]> {
    return this.backendService.get<CashPaymentDto[]>(this.endpoint);
  }

  getCashPaymentsByVoucherId(voucherId: number): Observable<CashPaymentDto[]> {
    return this.backendService.getByParentId<CashPaymentDto[]>(this.endpoint, 'voucher', voucherId);
  }

  getCashPayment(id: number): Observable<CashPaymentDto> {
    return this.backendService.getById<CashPaymentDto>(this.endpoint, id);
  }

  createCashPayment(payment: CashPayment): Observable<CashPaymentDto> {
    return this.backendService.post<CashPaymentDto>(this.endpoint, payment);
  }

  updateCashPayment(id: number, payment: CashPayment): Observable<any> {
    return this.backendService.put(this.endpoint, id, payment);
  }

  deleteCashPayment(id: number): Observable<any> {
    return this.backendService.delete(this.endpoint, id);
  }
}