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
    public class ApprovalController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ApprovalController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Approval
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ApprovalDto>>> GetApprovals()
        {
            var approvals = await _context.Approvals.ToListAsync();
            var result = new List<ApprovalDto>();
            
            foreach (var approval in approvals)
            {
                result.Add(new ApprovalDto
                {
                    Approval = approval,
                    Approver = await _context.Employees.FindAsync(approval.ApproverId),
                    PettyCashVoucher = await _context.PettyCashVouchers.FindAsync(approval.VoucherId)
                });
            }
            
            return result;
        }

        // GET: api/Approval/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ApprovalDto>> GetApproval(int id)
        {
            var approval = await _context.Approvals.FindAsync(id);

            if (approval == null)
            {
                return NotFound();
            }

            var dto = new ApprovalDto
            {
                Approval = approval,
                Approver = await _context.Employees.FindAsync(approval.ApproverId),
                PettyCashVoucher = await _context.PettyCashVouchers.FindAsync(approval.VoucherId)
            };

            return dto;
        }

        // GET: api/Approval/voucher/5
        [HttpGet("voucher/{voucherId}")]
        public async Task<ActionResult<IEnumerable<ApprovalDto>>> GetApprovalsByVoucherId(int voucherId)
        {
            var approvals = await _context.Approvals
                .Where(a => a.VoucherId == voucherId)
                .ToListAsync();
                
            var result = new List<ApprovalDto>();
            
            foreach (var approval in approvals)
            {
                result.Add(new ApprovalDto
                {
                    Approval = approval,
                    Approver = await _context.Employees.FindAsync(approval.ApproverId),
                    PettyCashVoucher = await _context.PettyCashVouchers.FindAsync(approval.VoucherId)
                });
            }
            
            return result;
        }

        // POST: api/Approval
        [HttpPost]
        public async Task<ActionResult<Approval>> CreateApproval(Approval approval)
        {
            // Set timestamps
            approval.ApprovalDate = DateTime.UtcNow;
            approval.CreatedAt = DateTime.UtcNow;
            approval.UpdatedAt = DateTime.UtcNow;
            
            if (string.IsNullOrEmpty(approval.UpdatedBy))
            {
                approval.UpdatedBy = approval.CreatedBy;
            }

            _context.Approvals.Add(approval);
            await _context.SaveChangesAsync();

            // Update voucher status
            var voucher = await _context.PettyCashVouchers.FindAsync(approval.VoucherId);
            if (voucher != null)
            {
                voucher.Status = approval.ApprovalStatus;
                voucher.UpdatedBy = approval.CreatedBy;
                voucher.UpdatedAt = DateTime.UtcNow;
                
                _context.Entry(voucher).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }

            // Return DTO
            var dto = new ApprovalDto
            {
                Approval = approval,
                Approver = await _context.Employees.FindAsync(approval.ApproverId),
                PettyCashVoucher = await _context.PettyCashVouchers.FindAsync(approval.VoucherId)
            };

            return CreatedAtAction(nameof(GetApproval), new { id = approval.ApprovalId }, dto);
        }

        // PUT: api/Approval/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateApproval(int id, Approval approval)
        {
            if (id != approval.ApprovalId)
            {
                return BadRequest();
            }

            approval.UpdatedAt = DateTime.UtcNow;

            _context.Entry(approval).State = EntityState.Modified;
            // Don't modify CreatedAt or CreatedBy
            _context.Entry(approval).Property(x => x.CreatedAt).IsModified = false;
            _context.Entry(approval).Property(x => x.CreatedBy).IsModified = false;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ApprovalExists(id))
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

        // DELETE: api/Approval/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteApproval(int id)
        {
            var approval = await _context.Approvals.FindAsync(id);
            if (approval == null)
            {
                return NotFound();
            }

            _context.Approvals.Remove(approval);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ApprovalExists(int id)
        {
            return _context.Approvals.Any(e => e.ApprovalId == id);
        }
    }
}