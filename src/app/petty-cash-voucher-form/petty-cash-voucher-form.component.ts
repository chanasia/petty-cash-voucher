import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PettyCashVoucherService } from '../services/petty-cash-voucher.service';
import { EmployeeService } from '../services/employee.service';
import { CompanyService } from '../services/company.service';
import { Employee } from '../models/employee.model';
import { Company } from '../models/company.model';

@Component({
    selector: 'app-petty-cash-voucher-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './petty-cash-voucher-form.component.html',
    styleUrls: ['./petty-cash-voucher-form.component.scss']
})
export class PettyCashVoucherFormComponent implements OnInit {
    voucherForm!: FormGroup;
    employees: Employee[] = [];
    companies: Company[] = [];
    loading = {
        employees: false,
        companies: false
    };

    constructor(
        private fb: FormBuilder,
        private voucherService: PettyCashVoucherService,
        private employeeService: EmployeeService,
        private companyService: CompanyService
    ) { }

    ngOnInit(): void {
        this.loadEmployees();
        this.loadCompanies();
        this.createForm();
    }

    createForm() {
        this.voucherForm = this.fb.group({
            company_id: [null, Validators.required],
            voucher_no: ['', Validators.required],
            request_date: [new Date(), Validators.required],
            requested_by: [null, Validators.required],
            total_amount: [0, [Validators.required, Validators.min(0)]],
            status: ['DRAFT', Validators.required],
            remarks: [''],
            is_active: [true],
            created_by: ['system']
        });
    }

    loadEmployees(): void {
        this.loading.employees = true;
        this.employeeService.getEmployees().subscribe({
            next: (data) => {
                this.employees = data;
                this.loading.employees = false;
            },
            error: (error) => {
                console.error('Error fetching employees:', error);
                this.loading.employees = false;
            }
        });
    }

    loadCompanies(): void {
        this.loading.companies = true;
        this.companyService.getCompanies().subscribe({
            next: (data) => {
                this.companies = data;
                this.loading.companies = false;
            },
            error: (error) => {
                console.error('Error fetching companies:', error);
                this.loading.companies = false;
            }
        });
    }

    onSubmit() {
        if (this.voucherForm.valid) {
            // Create a new object to match the backend model property names
            const voucherData = {
                companyId: this.voucherForm.value.company_id,
                voucherNo: this.voucherForm.value.voucher_no,
                requestDate: this.voucherForm.value.request_date,
                requestedById: this.voucherForm.value.requested_by,
                totalAmount: this.voucherForm.value.total_amount,
                status: this.voucherForm.value.status,
                remarks: this.voucherForm.value.remarks || '',
                isActive: this.voucherForm.value.is_active,
                createdBy: this.voucherForm.value.created_by || 'system',
                updatedBy: this.voucherForm.value.created_by || 'system',
            };

            // Show loading indicator or disable the submit button
            const submitBtn = document.querySelector('button[type="submit"]') as HTMLButtonElement;
            if (submitBtn) submitBtn.disabled = true;

            this.voucherService.createVoucher(voucherData).subscribe({
                next: (result) => {
                    console.log('บันทึกสำเร็จ', result);

                    // Show success message
                    alert('บันทึกใบเบิกเงินสดย่อยเรียบร้อยแล้ว');

                    // Reset form
                    this.voucherForm.reset();
                    this.createForm();

                    // Re-enable submit button
                    if (submitBtn) submitBtn.disabled = false;
                },
                error: (err) => {
                    console.error('เกิดข้อผิดพลาด', err);

                    // Show error message
                    alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' + (err.error?.message || err.message || 'โปรดลองใหม่อีกครั้ง'));

                    // Re-enable submit button
                    if (submitBtn) submitBtn.disabled = false;
                }
            });
        } else {
            // Mark all fields as touched to trigger validation messages
            Object.keys(this.voucherForm.controls).forEach(key => {
                const control = this.voucherForm.get(key);
                control?.markAsTouched();
            });

            alert('กรุณากรอกข้อมูลให้ครบถ้วน');
        }
    }
}