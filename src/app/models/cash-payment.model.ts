import { Employee } from "./employee.model";
import { PettyCashVoucher, VoucherDto } from "./petty-cash-voucher.model";

export interface CashPayment {
  paymentId?: number;
  voucherId: number;
  paidDate: Date;
  paidById: number;
  paidAmount: number;
  paymentMethod: string;
  referenceNumber?: string;
  isActive: boolean;
  createdBy: string;
  createdAt?: Date;
  updatedBy?: string;
  updatedAt?: Date;
}

export interface CashPaymentDto {
  payment: CashPayment;
  voucher: VoucherDto;
  paidBy: Employee;
}