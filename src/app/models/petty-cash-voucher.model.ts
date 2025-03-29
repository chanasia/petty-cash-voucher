import { Company } from "./company.model";
import { Employee } from "./employee.model";

export interface PettyCashVoucher {
  voucherId?: number;
  companyId: number;
  voucherNo: string;
  requestDate: Date;
  requestedById: number;
  totalAmount: number;
  status: string;
  remarks?: string;
  isActive: boolean;
  createdBy: string;

  company?: Company;
  requestedBy?: Employee;
}

export interface VoucherDto {
  voucher: {
      voucherId: number;
      voucherNo: string;
      requestDate: string;
      totalAmount: number;
      status: string;
  };
  company: Company | null;
  requestedBy: Employee | null;
}