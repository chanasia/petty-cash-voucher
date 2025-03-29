using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PettyCashVoucherAPI.Data;
using PettyCashVoucherAPI.DTOs;
using PettyCashVoucherAPI.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PettyCashVoucherAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PettyCashVoucherController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PettyCashVoucherController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PettyCashVoucherDto>>> GetVouchers()
        {
            var vouchers = await _context.PettyCashVouchers.ToListAsync();
            var result = new List<PettyCashVoucherDto>();

            foreach (var voucher in vouchers)
            {
                result.Add(new PettyCashVoucherDto
                {
                    Voucher = voucher,
                    Company = await _context.Company.FindAsync(voucher.CompanyId),
                    RequestedBy = await _context.Employees.FindAsync(voucher.RequestedById)
                });
            }

            return result;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PettyCashVoucherDto>> GetVoucher(int id)
        {
            var voucher = await _context.PettyCashVouchers.FindAsync(id);

            if (voucher == null)
            {
                return NotFound();
            }

            var dto = new PettyCashVoucherDto
            {
                Voucher = voucher,
                Company = await _context.Company.FindAsync(voucher.CompanyId),
                RequestedBy = await _context.Employees.FindAsync(voucher.RequestedById)
            };

            return dto;
        }

        [HttpPost]
        public async Task<ActionResult<PettyCashVoucher>> CreateVoucher(PettyCashVoucher voucher)
        {
            voucher.CreatedAt = DateTime.UtcNow;
            voucher.UpdatedAt = DateTime.UtcNow;

            _context.PettyCashVouchers.Add(voucher);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetVoucher), new { id = voucher.VoucherId }, voucher);
        }

        // PUT: api/PettyCashVoucher/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateVoucher(int id, PettyCashVoucher voucher)
        {
            if (id != voucher.VoucherId)
            {
                return BadRequest();
            }

            voucher.UpdatedAt = DateTime.UtcNow;

            _context.Entry(voucher).State = EntityState.Modified;
            // Don't modify CreatedAt or CreatedBy
            _context.Entry(voucher).Property(x => x.CreatedAt).IsModified = false;
            _context.Entry(voucher).Property(x => x.CreatedBy).IsModified = false;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VoucherExists(id))
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

        private bool VoucherExists(int id)
        {
            return _context.PettyCashVouchers.Any(e => e.VoucherId == id);
        }
    }
}