import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PettyCashVoucherService } from '../services/petty-cash-voucher.service';
import { PettyCashVoucher, VoucherDto } from '../models/petty-cash-voucher.model';
import { PettyCashItemService } from '../services/petty-cash-item.service';
import { PdfReportService } from '../services/pdf-report.service';

@Component({
    selector: 'app-voucher-list',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './voucher-list.component.html',
    styleUrls: ['./voucher-list.component.scss']
})
export class VoucherListComponent implements OnInit {
    vouchers: VoucherDto[] = [];
    filteredVouchers: VoucherDto[] = [];
    loading = false;
    searchTerm = '';
    statusFilter = 'ALL';

    constructor(
        private voucherService: PettyCashVoucherService,
        private itemService: PettyCashItemService,
        private pdfService: PdfReportService
    ) { }

    ngOnInit(): void {
        this.loadVouchers();
    }

    loadVouchers(): void {
        this.loading = true;
        this.voucherService.getVouchers().subscribe({
            next: (data: VoucherDto[]) => {
                this.vouchers = data;
                this.filteredVouchers = [...data];
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading vouchers:', err);
                this.loading = false;
            }
        });
    }

    applyFilters(): void {
        this.filteredVouchers = this.vouchers.filter(voucher => {
            // Filter by search term
            const searchMatch =
                voucher.voucher.voucherNo.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                ((voucher.voucher as any).remarks && (voucher.voucher as any).remarks.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
                (voucher.company?.companyName && voucher.company.companyName.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
                ((voucher.requestedBy?.firstName || '') + ' ' + (voucher.requestedBy?.lastName || '')).toLowerCase().includes(this.searchTerm.toLowerCase());

            // Filter by status
            const statusMatch = this.statusFilter === 'ALL' || voucher.voucher.status === this.statusFilter;

            return searchMatch && statusMatch;
        });
    }

    onSearch(): void {
        this.applyFilters();
    }

    onStatusChange(): void {
        this.applyFilters();
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'DRAFT': return 'status-draft';
            case 'PENDING': return 'status-pending';
            case 'APPROVED': return 'status-approved';
            case 'REJECTED': return 'status-rejected';
            case 'PAID': return 'status-paid';
            default: return '';
        }
    }

    generatePDF(voucherDto: VoucherDto): void {
        // First, we need to fetch the items for this voucher
        this.itemService.getItemsByVoucherId(voucherDto.voucher.voucherId).subscribe({
            next: (items) => {
                // Now generate the PDF with the voucher data and its items
                this.pdfService.generateVoucherReport(voucherDto, items);
            },
            error: (err) => {
                console.error('Error fetching items for PDF generation:', err);
                alert('เกิดข้อผิดพลาดในการดึงข้อมูลรายการสำหรับสร้าง PDF');
            }
        });
    }
}