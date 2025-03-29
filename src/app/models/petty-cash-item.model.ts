export interface PettyCashItem {
  itemId?: number;
  voucherId: number;
  description: string;
  expenseDate: Date;
  amount: number;
  glAccount?: string;
  costCenter?: string;
  isActive: boolean;
  createdBy: string;
  createdAt?: Date;
  updatedBy?: string;
  updatedAt?: Date;
}