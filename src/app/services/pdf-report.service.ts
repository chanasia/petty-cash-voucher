import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class PdfReportService {
  
  constructor() { }
  
  async generateVoucherReport(voucherData: any, items: any[]): Promise<void> {
    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    
    // Create a temporary div for rendering
    const reportElement = document.createElement('div');
    reportElement.style.width = '750px'; // Approximate A4 width
    reportElement.style.padding = '40px';
    reportElement.style.position = 'absolute';
    reportElement.style.top = '-9999px';
    reportElement.style.left = '-9999px';
    reportElement.style.fontFamily = 'THSarabun, Arial, sans-serif';
    
    // Add the HTML content with Thai text
    reportElement.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="font-size: 24px; margin-bottom: 5px;">ใบเบิกเงินสดย่อย</h1>
        <h2 style="font-size: 20px; margin-top: 0;">Petty Cash Voucher</h2>
      </div>
      
      <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
        <div>
          <p><strong>เลขที่ใบเบิก:</strong> ${voucherData.voucher.voucherNo || '-'}</p>
          <p><strong>บริษัท:</strong> ${voucherData.company?.companyName || '-'}</p>
        </div>
        <div>
          <p><strong>วันที่:</strong> ${this.formatDate(voucherData.voucher.requestDate)}</p>
          <p><strong>สถานะ:</strong> ${voucherData.voucher.status || '-'}</p>
        </div>
      </div>
      
      <div style="margin-bottom: 10px;">
        <p><strong>ผู้ขอเบิก:</strong> ${voucherData.requestedBy?.firstName || ''} ${voucherData.requestedBy?.lastName || ''}</p>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">รายการ</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">วันที่ใช้จ่าย</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">จำนวนเงิน</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">รหัสบัญชี</th>
            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">ศูนย์ต้นทุน</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(item => `
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">${item.description || '-'}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${this.formatDate(item.expenseDate)}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${this.formatAmount(item.amount)}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${item.glAccount || '-'}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${item.costCenter || '-'}</td>
            </tr>
          `).join('')}
          <tr style="font-weight: bold; background-color: #f2f2f2;">
            <td colspan="2" style="border: 1px solid #ddd; padding: 8px; text-align: right;">รวมทั้งสิ้น</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${this.formatAmount(totalAmount)}</td>
            <td colspan="2" style="border: 1px solid #ddd; padding: 8px;"></td>
          </tr>
        </tbody>
      </table>
      
      <div style="display: flex; justify-content: space-between; margin-top: 50px;">
        <div style="width: 45%; text-align: center;">
          <div style="border-top: 1px solid #000; padding-top: 5px; margin-bottom: 20px;">
            ลงชื่อ............................................
          </div>
          <p>(${voucherData.requestedBy?.firstName || ''} ${voucherData.requestedBy?.lastName || ''})</p>
          <p>ผู้ขอเบิก</p>
        </div>
        
        <div style="width: 45%; text-align: center;">
          <div style="border-top: 1px solid #000; padding-top: 5px; margin-bottom: 20px;">
            ลงชื่อ............................................
          </div>
          <p>(.................................................)</p>
          <p>ผู้อนุมัติ</p>
        </div>
      </div>
    `;
    
    // Add the element to the document
    document.body.appendChild(reportElement);
    
    try {
      // Render the element to a canvas
      const canvas = await html2canvas(reportElement, {
        scale: 2, // Higher scale for better quality
        logging: false,
        useCORS: true
      });
      
      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasRatio = canvas.height / canvas.width;
      const pdfImageWidth = pdfWidth;
      const pdfImageHeight = pdfWidth * canvasRatio;
      
      // Add the image to the PDF
      pdf.addImage(imgData, 'PNG', 0, 0, pdfImageWidth, pdfImageHeight);
      
      // If the content is longer than one page, add more pages
      if (pdfImageHeight > pdfHeight) {
        const pageCount = Math.ceil(pdfImageHeight / pdfHeight);
        for (let i = 1; i < pageCount; i++) {
          pdf.addPage();
          pdf.addImage(
            imgData, 
            'PNG', 
            0, 
            -pdfHeight * i, 
            pdfImageWidth, 
            pdfImageHeight
          );
        }
      }
      
      // Save the PDF
      pdf.save(`petty_cash_voucher_${voucherData.voucher.voucherNo || 'report'}.pdf`);
    } finally {
      // Clean up - remove the temporary element
      if (reportElement.parentNode) {
        document.body.removeChild(reportElement);
      }
    }
  }
  
  // Helper methods
  private formatDate(dateString: string | null | undefined): string {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  private formatAmount(amount: number | string | null | undefined): string {
    if (amount === null || amount === undefined) return '-';
    
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(num)) return '-';
    
    return num.toLocaleString('th-TH', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + ' บาท';
  }
}