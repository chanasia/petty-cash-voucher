using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PettyCashVoucherAPI.Models
{
    public class Approval
    {
        [Key]
        [Column("approval_id")]
        public int ApprovalId { get; set; }

        [Column("voucher_id")]
        public int VoucherId { get; set; }

        [Column("approver_id")]
        public int ApproverId { get; set; }

        [Column("approval_date")]
        public DateTime ApprovalDate { get; set; }

        [Column("approval_status")]
        [StringLength(50)]
        public string ApprovalStatus { get; set; }

        [Column("comments")]
        [StringLength(255)]
        public string Comments { get; set; }

        [Column("is_active")]
        public bool IsActive { get; set; }

        [Column("created_by")]
        [StringLength(50)]
        public string CreatedBy { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Column("updated_by")]
        [StringLength(50)]
        public string UpdatedBy { get; set; }

        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        // [ForeignKey("VoucherId")]
        // public virtual PettyCashVoucher PettyCashVoucher { get; set; }

        // [ForeignKey("ApproverId")]
        // public virtual Employee Approver { get; set; }
    }
}