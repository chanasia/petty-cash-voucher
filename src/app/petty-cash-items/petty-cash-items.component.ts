import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PettyCashItemService } from '../services/petty-cash-item.service';
import { PettyCashVoucherService } from '../services/petty-cash-voucher.service';
import { PettyCashItem } from '../models/petty-cash-item.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-petty-cash-items',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './petty-cash-items.component.html',
  styleUrls: ['./petty-cash-items.component.scss']
})
export class PettyCashItemsComponent implements OnInit {
  voucherId!: number;
  voucherInfo: any = {};
  itemsForm!: FormGroup;
  items: PettyCashItem[] = [];
  loading = false;
  submitting = false;
  pdfService: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private itemService: PettyCashItemService,
    private voucherService: PettyCashVoucherService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.voucherId = +params['id'];
      this.loadVoucherInfo();
      this.loadItems();
      this.createForm();
    });
  }

  submitForApproval(): void {
    if (confirm('ยืนยันการส่งใบเบิกเพื่อขออนุมัติ? เมื่อส่งแล้วจะไม่สามารถแก้ไขข้อมูลได้')) {
      const voucher = { ...this.voucherInfo.voucher };
      voucher.status = 'PENDING';

      this.voucherService.updateVoucher(this.voucherId, voucher).subscribe({
        next: () => {
          alert('ส่งใบเบิกเพื่อขออนุมัติเรียบร้อยแล้ว');
          this.loadVoucherInfo();
        },
        error: (err) => {
          console.error('Error updating voucher status:', err);
          alert('เกิดข้อผิดพลาดในการส่งใบเบิกเพื่อขออนุมัติ');
        }
      });
    }
  }

  createForm(): void {
    this.itemsForm = this.fb.group({
      items: this.fb.array([])
    });
    this.addNewItemRow();
  }

  get itemsArray(): FormArray {
    return this.itemsForm.get('items') as FormArray;
  }

  addNewItemRow(): void {
    const itemGroup = this.fb.group({
      description: ['', Validators.required],
      expenseDate: [new Date(), Validators.required],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      glAccount: [''],
      costCenter: [''],
      isActive: [true]
    });

    this.itemsArray.push(itemGroup);
  }

  removeItemRow(index: number): void {
    this.itemsArray.removeAt(index);
  }

  loadVoucherInfo(): void {
    this.loading = true;
    this.voucherService.getVoucherById(this.voucherId).subscribe({
      next: (data) => {
        this.voucherInfo = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading voucher:', err);
        this.loading = false;
        alert('ไม่สามารถโหลดข้อมูลใบเบิกได้');
      }
    });
  }

  loadItems(): void {
    this.loading = true;
    this.itemService.getItemsByVoucherId(this.voucherId).subscribe({
      next: (data) => {
        this.items = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading items:', err);
        this.loading = false;
      }
    });
  }

  onSaveItems(): void {
    if (this.itemsForm.valid) {
      this.submitting = true;

      const newItems = this.itemsArray.value.map((item: any) => {
        return {
          voucherId: this.voucherId,
          description: item.description,
          expenseDate: item.expenseDate,
          amount: item.amount,
          glAccount: item.glAccount,
          costCenter: item.costCenter,
          isActive: item.isActive,
          createdBy: 'system',
          updatedBy: 'system'
        };
      });

      // Create items one by one with proper typing
      const savePromises = newItems.map((item: PettyCashItem) => {
        return firstValueFrom(this.itemService.createItem(item));
      });

      Promise.all(savePromises)
        .then(() => {
          alert('บันทึกรายการเรียบร้อยแล้ว');
          this.loadItems();
          this.createForm(); // Reset form
          this.submitting = false;
        })
        .catch(err => {
          console.error('Error saving items:', err);
          alert('เกิดข้อผิดพลาดในการบันทึกรายการ');
          this.submitting = false;
        });
    } else {
      // Mark all fields as touched to show validation errors
      Object.values(this.itemsArray.controls).forEach(control => {
        control.markAllAsTouched();
      });
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
    }
  }

  onDeleteItem(id: number): void {
    if (confirm('คุณต้องการลบรายการนี้ใช่หรือไม่?')) {
      this.itemService.deleteItem(id).subscribe({
        next: () => {
          alert('ลบรายการเรียบร้อยแล้ว');
          this.loadItems();
        },
        error: (err) => {
          console.error('Error deleting item:', err);
          alert('เกิดข้อผิดพลาดในการลบรายการ');
        }
      });
    }
  }

  calculateTotal(): number {
    return this.items.reduce((sum, item) => sum + item.amount, 0);
  }

  goBack(): void {
    this.router.navigate(['/vouchers']);
  }

  generatePDF(): void {
    if (this.voucherInfo && this.items.length > 0) {
      this.pdfService.generateVoucherReport(this.voucherInfo, this.items);
    } else {
      alert('ไม่มีข้อมูลสำหรับสร้าง PDF');
    }
  }
}