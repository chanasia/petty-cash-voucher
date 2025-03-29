// src/app/cash-payment/cash-payment.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PettyCashVoucherService } from '../services/petty-cash-voucher.service';
import { CashPaymentService } from '../services/cash-payment.service';
import { EmployeeService } from '../services/employee.service';
import { CashPayment } from '../models/cash-payment.model';

@Component({
  selector: 'app-cash-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './cash-payment.component.html',
  styleUrls: ['./cash-payment.component.scss']
})
export class CashPaymentComponent implements OnInit {
  voucherId!: number;
  voucherInfo: any = null;
  paymentForm!: FormGroup;
  payments: any[] = [];
  employees: any[] = [];
  loading = {
    voucher: false,
    payments: false,
    employees: false
  };
  submitting = false;
  paymentMethods = [
    { value: 'CASH', label: 'เงินสด' },
    { value: 'TRANSFER', label: 'โอนเงิน' },
    { value: 'CHECK', label: 'เช็ค' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private voucherService: PettyCashVoucherService,
    private paymentService: CashPaymentService,
    private employeeService: EmployeeService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.voucherId = +params['id'];
      this.loadVoucherInfo();
      this.loadPayments();
      this.loadEmployees();
      this.createForm();
    });
  }

  createForm(): void {
    this.paymentForm = this.fb.group({
      paidById: [null, Validators.required],
      paidAmount: [0, [Validators.required, Validators.min(0.01)]],
      paymentMethod: ['CASH', Validators.required],
      referenceNumber: [''],
      paidDate: [new Date(), Validators.required]
    });
  }

  loadVoucherInfo(): void {
    this.loading.voucher = true;
    this.voucherService.getVoucherById(this.voucherId).subscribe({
      next: (data) => {
        this.voucherInfo = data;
        // Set the default amount to the voucher total
        if (data?.totalAmount) {
          this.paymentForm.patchValue({
            paidAmount: data.totalAmount
          });
        }
        this.loading.voucher = false;
      },
      error: (err) => {
        console.error('Error loading voucher:', err);
        this.loading.voucher = false;
      }
    });
  }

  loadPayments(): void {
    this.loading.payments = true;
    this.paymentService.getCashPaymentsByVoucherId(this.voucherId).subscribe({
      next: (data) => {
        this.payments = data;
        this.loading.payments = false;
      },
      error: (err) => {
        console.error('Error loading payments:', err);
        this.loading.payments = false;
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
    if (this.paymentForm.valid) {
      this.submitting = true;
      
      const payment: CashPayment = {
        voucherId: this.voucherId,
        paidById: this.paymentForm.value.paidById,
        paidAmount: this.paymentForm.value.paidAmount,
        paymentMethod: this.paymentForm.value.paymentMethod,
        referenceNumber: this.paymentForm.value.referenceNumber,
        paidDate: this.paymentForm.value.paidDate,
        isActive: true,
        createdBy: 'system',
        updatedBy: 'system'
      };
      
      this.paymentService.createCashPayment(payment).subscribe({
        next: (result) => {
          alert('บันทึกการชำระเงินเรียบร้อยแล้ว');
          this.loadPayments();
          this.createForm();
          this.submitting = false;
          
          // Update voucher status to PAID if needed
          this.updateVoucherStatusToPaid();
        },
        error: (err) => {
          console.error('Error creating payment:', err);
          alert('เกิดข้อผิดพลาดในการบันทึกการชำระเงิน');
          this.submitting = false;
        }
      });
    } else {
      Object.values(this.paymentForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }

  updateVoucherStatusToPaid(): void {
    if (!this.voucherInfo || !this.voucherInfo.voucher) return;
    
    const voucher = { ...this.voucherInfo.voucher };
    voucher.status = 'PAID';
    
    this.voucherService.updateVoucher(this.voucherId, voucher).subscribe({
      next: () => {
        this.loadVoucherInfo();
      },
      error: (err) => {
        console.error('Error updating voucher status:', err);
      }
    });
  }

  getEmployeeName(id: number): string {
    const employee = this.employees.find(e => e.employeeId === id);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'N/A';
  }

  getPaymentMethodLabel(method: string): string {
    const paymentMethod = this.paymentMethods.find(m => m.value === method);
    return paymentMethod ? paymentMethod.label : method;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('th-TH');
  }

  goBack(): void {
    this.router.navigate(['/vouchers']);
  }
}