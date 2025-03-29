using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PettyCashVoucherAPI.Models
{
    public class CashPayment
    {
        [Key]
        [Column("payment_id")]
        public int PaymentId { get; set; }

        [Column("voucher_id")]
        public int VoucherId { get; set; }

        [Column("paid_date")]
        public DateTime PaidDate { get; set; }

        [Column("paid_by")]
        public int PaidById { get; set; }

        [Column("paid_amount", TypeName = "decimal(12,2)")]
        public decimal PaidAmount { get; set; }

        [Column("payment_method")]
        [StringLength(50)]
        public string PaymentMethod { get; set; }

        [Column("reference_number")]
        [StringLength(100)]
        public string ReferenceNumber { get; set; }

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
    }
}