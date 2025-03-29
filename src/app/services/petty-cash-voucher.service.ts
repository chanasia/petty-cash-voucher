import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PettyCashVoucher, VoucherDto } from '../models/petty-cash-voucher.model';
import { BackendService } from './backend.service';

@Injectable({
    providedIn: 'root'
})
export class PettyCashVoucherService {
    private endpoint = 'PettyCashVoucher';

    constructor(private backendService: BackendService) { }

    getVouchers(): Observable<VoucherDto[]> {
        return this.backendService.get<VoucherDto[]>(this.endpoint);
    }

    getVoucherById(id: number): Observable<PettyCashVoucher> {
        return this.backendService.getById<PettyCashVoucher>(this.endpoint, id);
    }

    createVoucher(voucher: PettyCashVoucher): Observable<PettyCashVoucher> {
        return this.backendService.post<PettyCashVoucher>(this.endpoint, voucher);
    }

    updateVoucher(id: number, voucher: any): Observable<any> {
        return this.backendService.put(this.endpoint, id, voucher);
    }
}