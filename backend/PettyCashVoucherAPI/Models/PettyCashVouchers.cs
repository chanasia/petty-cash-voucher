using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PettyCashVoucherAPI.Models
{
    public class PettyCashVoucher
    {
        [Key]
        [Column("voucher_id")]
        public int VoucherId { get; set; }

        [ForeignKey("Company")]
        [Column("company_id")]
        public int CompanyId { get; set; }

        [Column("voucher_no")]
        [StringLength(50)]
        public string VoucherNo { get; set; }

        [Column("request_date")]
        public DateTime RequestDate { get; set; }

        [Column("requested_by")]
        public int RequestedById { get; set; }

        [Column("total_amount", TypeName = "decimal(12,2)")]
        public decimal TotalAmount { get; set; }

        [Column("status")]
        [StringLength(50)]
        public string Status { get; set; }

        [Column("remarks")]
        [StringLength(255)]
        public string Remarks { get; set; }

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

        // Navigation properties for relationships
        // public virtual Company Company { get; set; }
        // public virtual Employee Employee { get; set; }
    }
}