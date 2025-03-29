import { Employee } from "./employee.model";
import { PettyCashVoucher } from "./petty-cash-voucher.model";

export interface Approval {
  approvalId?: number;
  voucherId: number;
  approverId: number;
  approvalDate?: Date;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  comments?: string;
  isActive: boolean;
  createdBy: string;
  createdAt?: Date;
  updatedBy?: string;
  updatedAt?: Date; 
}

export interface ApprovalDto {
  approval: Approval;
  approver: Employee;
  pettyCashVoucher: PettyCashVoucher;
}