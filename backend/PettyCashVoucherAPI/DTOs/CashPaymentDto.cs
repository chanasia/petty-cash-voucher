using PettyCashVoucherAPI.Models;

namespace PettyCashVoucherAPI.DTOs
{
    public class CashPaymentDto
    {
        public CashPayment Payment { get; set; }
        public PettyCashVoucher Voucher { get; set; }
        public Employee PaidBy { get; set; }
    }
}