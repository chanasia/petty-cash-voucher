using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PettyCashVoucherAPI.Data;
using PettyCashVoucherAPI.Models;
using PettyCashVoucherAPI.DTOs;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PettyCashVoucherAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CashPaymentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CashPaymentController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/CashPayment
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CashPaymentDto>>> GetPayments()
        {
            var payments = await _context.CashPayments.ToListAsync();
            var result = new List<CashPaymentDto>();
            
            foreach (var payment in payments)
            {
                result.Add(new CashPaymentDto
                {
                    Payment = payment,
                    Voucher = await _context.PettyCashVouchers.FindAsync(payment.VoucherId),
                    PaidBy = await _context.Employees.FindAsync(payment.PaidById)
                });
            }
            
            return result;
        }

        // GET: api/CashPayment/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CashPaymentDto>> GetPayment(int id)
        {
            var payment = await _context.CashPayments.FindAsync(id);

            if (payment == null)
            {
                return NotFound();
            }

            var dto = new CashPaymentDto
            {
                Payment = payment,
                Voucher = await _context.PettyCashVouchers.FindAsync(payment.VoucherId),
                PaidBy = await _context.Employees.FindAsync(payment.PaidById)
            };

            return dto;
        }

        // GET: api/CashPayment/voucher/5
        [HttpGet("voucher/{voucherId}")]
        public async Task<ActionResult<IEnumerable<CashPaymentDto>>> GetPaymentsByVoucherId(int voucherId)
        {
            var payments = await _context.CashPayments
                .Where(p => p.VoucherId == voucherId)
                .ToListAsync();
                
            var result = new List<CashPaymentDto>();
            
            foreach (var payment in payments)
            {
                result.Add(new CashPaymentDto
                {
                    Payment = payment,
                    Voucher = await _context.PettyCashVouchers.FindAsync(payment.VoucherId),
                    PaidBy = await _context.Employees.FindAsync(payment.PaidById)
                });
            }
            
            return result;
        }

        // POST: api/CashPayment
        [HttpPost]
        public async Task<ActionResult<CashPaymentDto>> CreatePayment(CashPayment payment)
        {
            // Set timestamps
            payment.CreatedAt = DateTime.UtcNow;
            payment.UpdatedAt = DateTime.UtcNow;
            
            if (string.IsNullOrEmpty(payment.UpdatedBy))
            {
                payment.UpdatedBy = payment.CreatedBy;
            }

            _context.CashPayments.Add(payment);
            await _context.SaveChangesAsync();

            // Update voucher status to PAID
            var voucher = await _context.PettyCashVouchers.FindAsync(payment.VoucherId);
            if (voucher != null)
            {
                voucher.Status = "PAID";
                voucher.UpdatedBy = payment.CreatedBy;
                voucher.UpdatedAt = DateTime.UtcNow;
                
                _context.Entry(voucher).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }

            // Return DTO
            var dto = new CashPaymentDto
            {
                Payment = payment,
                Voucher = voucher,
                PaidBy = await _context.Employees.FindAsync(payment.PaidById)
            };

            return CreatedAtAction(nameof(GetPayment), new { id = payment.PaymentId }, dto);
        }

        // PUT: api/CashPayment/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePayment(int id, CashPayment payment)
        {
            if (id != payment.PaymentId)
            {
                return BadRequest();
            }

            payment.UpdatedAt = DateTime.UtcNow;

            _context.Entry(payment).State = EntityState.Modified;
            // Don't modify CreatedAt or CreatedBy
            _context.Entry(payment).Property(x => x.CreatedAt).IsModified = false;
            _context.Entry(payment).Property(x => x.CreatedBy).IsModified = false;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PaymentExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/CashPayment/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePayment(int id)
        {
            var payment = await _context.CashPayments.FindAsync(id);
            if (payment == null)
            {
                return NotFound();
            }

            _context.CashPayments.Remove(payment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PaymentExists(int id)
        {
            return _context.CashPayments.Any(e => e.PaymentId == id);
        }
    }
}