using PettyCashVoucherAPI.Models;

namespace PettyCashVoucherAPI.DTOs
{
    public class ApprovalDto
    {
        public Approval Approval { get; set; }
        public Employee Approver { get; set; }
        public PettyCashVoucher PettyCashVoucher { get; set; }
    }
}