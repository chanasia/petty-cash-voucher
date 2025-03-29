using Microsoft.EntityFrameworkCore;
using PettyCashVoucherAPI.Models;

namespace PettyCashVoucherAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Employee> Employees { get; set; }
        public DbSet<Company> Company { get; set; }
        public DbSet<PettyCashVoucher> PettyCashVouchers { get; set; }
        public DbSet<PettyCashItem> PettyCashItems { get; set; }
        public DbSet<Approval> Approvals { get; set; }
        public DbSet<CashPayment> CashPayments { get; set; }

        // Add more DbSet properties for other tables here

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<PettyCashVoucher>().ToTable("petty_cash_vouchers");
            modelBuilder.Entity<PettyCashItem>().ToTable("petty_cash_items");
            modelBuilder.Entity<CashPayment>().ToTable("cash_payments");
        }
    }
}