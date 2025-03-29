using PettyCashVoucherAPI.Models;

namespace PettyCashVoucherAPI.DTOs
{
    public class PettyCashVoucherDto
    {
        public PettyCashVoucher Voucher { get; set; }
        public Company Company { get; set; }
        public Employee RequestedBy { get; set; }
    }
}