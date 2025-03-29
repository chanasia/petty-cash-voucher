import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PettyCashVoucherService } from '../services/petty-cash-voucher.service';
import { ApprovalService } from '../services/approval.service';
import { EmployeeService } from '../services/employee.service';
import { PettyCashItemService } from '../services/petty-cash-item.service';
import { Approval, ApprovalDto } from '../models/approval.model';

@Component({
  selector: 'app-voucher-approval',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './voucher-approval.component.html',
  styleUrls: ['./voucher-approval.component.scss']
})
export class VoucherApprovalComponent implements OnInit {
  voucherId!: number;
  voucherInfo: any = null;
  items: any[] = [];
  approvals: ApprovalDto[] = [];
  approvalForm!: FormGroup;
  employees: any[] = [];
  loading = {
    voucher: false,
    items: false,
    approvals: false,
    employees: false
  };
  submitting = false;
  currentUser = { id: 1, name: 'Admin' }; // This would come from authentication

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private voucherService: PettyCashVoucherService,
    private approvalService: ApprovalService,
    private employeeService: EmployeeService,
    private itemService: PettyCashItemService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.voucherId = +params['id'];
      this.loadVoucherInfo();
      this.loadItems();
      this.loadApprovals();
      this.loadEmployees();
      this.createForm();
    });
  }

  createForm(): void {
    this.approvalForm = this.fb.group({
      approverId: [this.currentUser.id, Validators.required],
      approvalStatus: ['APPROVED', Validators.required],
      comments: ['']
    });
  }

  loadVoucherInfo(): void {
    this.loading.voucher = true;
    this.voucherService.getVoucherById(this.voucherId).subscribe({
      next: (data) => {
        this.voucherInfo = data;
        this.loading.voucher = false;
      },
      error: (err) => {
        console.error('Error loading voucher:', err);
        this.loading.voucher = false;
      }
    });
  }

  loadItems(): void {
    this.loading.items = true;
    this.itemService.getItemsByVoucherId(this.voucherId).subscribe({
      next: (data) => {
        this.items = data;
        this.loading.items = false;
      },
      error: (err) => {
        console.error('Error loading items:', err);
        this.loading.items = false;
      }
    });
  }

  loadApprovals(): void {
    this.loading.approvals = true;
    this.approvalService.getApprovalsByVoucherId(this.voucherId).subscribe({
      next: (data) => {
        this.approvals = data;
        this.loading.approvals = false;
      },
      error: (err) => {
        console.error('Error loading approvals:', err);
        this.loading.approvals = false;
      }
    });
  }

  loadEmployees(): void {
    this.loading.employees = true;
    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.loading.employees = false;
      },
      error: (err) => {
        console.error('Error loading employees:', err);
        this.loading.employees = false;
      }
    });
  }

  onSubmit(): void {
    if (this.approvalForm.valid) {
      this.submitting = true;
      
      const approval: Approval = {
        voucherId: this.voucherId,
        approverId: this.approvalForm.value.approverId,
        approvalStatus: this.approvalForm.value.approvalStatus,
        comments: this.approvalForm.value.comments,
        isActive: true,
        createdBy: this.currentUser.name,
        updatedBy: this.currentUser.name
      };
      
      this.approvalService.approveVoucher(approval).subscribe({
        next: (result) => {
          // Also update the voucher status
          this.updateVoucherStatus(this.approvalForm.value.approvalStatus);
        },
        error: (err) => {
          console.error('Error submitting approval:', err);
          alert('เกิดข้อผิดพลาดในการบันทึกการอนุมัติ');
          this.submitting = false;
        }
      });
    } else {
      Object.values(this.approvalForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }

  updateVoucherStatus(status: string): void {
    if (!this.voucherInfo || !this.voucherInfo.voucher) return;
    
    const voucher = { ...this.voucherInfo.voucher };
    voucher.status = status;
    voucher.updatedBy = this.currentUser.name;
    
    this.voucherService.updateVoucher(this.voucherId, voucher).subscribe({
      next: () => {
        alert('บันทึกการอนุมัติเรียบร้อยแล้ว');
        this.loadVoucherInfo();
        this.loadApprovals();
        this.approvalForm.reset();
        this.createForm();
        this.submitting = false;
      },
      error: (err) => {
        console.error('Error updating voucher status:', err);
        alert('เกิดข้อผิดพลาดในการอัพเดทสถานะใบเบิก');
        this.submitting = false;
      }
    });
  }

  calculateTotal(): number {
    return this.items.reduce((sum, item) => sum + item.amount, 0);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'APPROVED': return 'status-approved';
      case 'REJECTED': return 'status-rejected';
      case 'PENDING': return 'status-pending';
      default: return '';
    }
  }

  getEmployeeName(id: number): string {
    const employee = this.employees.find(e => e.employeeId === id);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'N/A';
  }

  goBack(): void {
    this.router.navigate(['/vouchers']);
  }
}