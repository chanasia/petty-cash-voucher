using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PettyCashVoucherAPI.Models
{
    public class Company
    {
        [Key]
        [Column("company_id")]
        public int CompanyId { get; set; }

        [Required]
        [Column("company_code")]
        [StringLength(5)]
        public string CompanyCode { get; set; }

        [Required]
        [Column("company_name")]
        [StringLength(50)]
        public string CompanyName { get; set; }
    }
}