using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PettyCashVoucherAPI.Models
{
    public class PettyCashItem
    {
        [Key]
        [Column("item_id")]
        public int ItemId { get; set; }

        [Column("voucher_id")]
        public int VoucherId { get; set; }

        [Column("description")]
        [StringLength(255)]
        public string Description { get; set; }

        [Column("expense_date")]
        public DateTime ExpenseDate { get; set; }

        [Column("amount", TypeName = "decimal(12,2)")]
        public decimal Amount { get; set; }

        [Column("gl_account")]
        [StringLength(50)]
        public string GlAccount { get; set; }

        [Column("cost_center")]
        [StringLength(50)]
        public string CostCenter { get; set; }

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

        // Navigation property
        // [ForeignKey("VoucherId")]
        // public virtual PettyCashVoucher PettyCashVoucher { get; set; }
    }
}