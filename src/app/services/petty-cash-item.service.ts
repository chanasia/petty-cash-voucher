import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PettyCashItem } from '../models/petty-cash-item.model';
import { BackendService } from './backend.service';

@Injectable({
  providedIn: 'root'
})
export class PettyCashItemService {
  private endpoint = 'PettyCashItem';

  constructor(private backendService: BackendService) { }

  getItemsByVoucherId(voucherId: number): Observable<PettyCashItem[]> {
    return this.backendService.getByParentId<PettyCashItem[]>(this.endpoint, 'voucher', voucherId);
  }

  createItem(item: PettyCashItem): Observable<PettyCashItem> {
    return this.backendService.post<PettyCashItem>(this.endpoint, item);
  }

  updateItem(id: number, item: PettyCashItem): Observable<PettyCashItem> {
    return this.backendService.put<PettyCashItem>(this.endpoint, id, item);
  }

  deleteItem(id: number): Observable<any> {
    return this.backendService.delete(this.endpoint, id);
  }
}