import { Routes } from '@angular/router';
import { VoucherListComponent } from './voucher-list/voucher-list.component';
import { PettyCashVoucherFormComponent } from './petty-cash-voucher-form/petty-cash-voucher-form.component';
import { PettyCashItemsComponent } from './petty-cash-items/petty-cash-items.component';
import { VoucherApprovalComponent } from './voucher-approval/voucher-approval.component';
import { CashPaymentComponent } from './cash-payment/cash-payment.component';

export const routes: Routes = [
  { path: '', redirectTo: '/vouchers', pathMatch: 'full' },
  { path: 'vouchers', component: VoucherListComponent },
  { path: 'voucher/new', component: PettyCashVoucherFormComponent },
  { path: 'voucher/:id/items', component: PettyCashItemsComponent },
  { path: 'voucher/:id/approval', component: VoucherApprovalComponent },
  { path: 'voucher/:id/payment', component: CashPaymentComponent }
];