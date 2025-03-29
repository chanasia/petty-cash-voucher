using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PettyCashVoucherAPI.Data;
using PettyCashVoucherAPI.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PettyCashVoucherAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PettyCashItemController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PettyCashItemController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/PettyCashItem
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PettyCashItem>>> GetItems()
        {
            return await _context.PettyCashItems.ToListAsync();
        }

        // GET: api/PettyCashItem/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PettyCashItem>> GetItem(int id)
        {
            var item = await _context.PettyCashItems.FindAsync(id);

            if (item == null)
            {
                return NotFound();
            }

            return item;
        }

        // GET: api/PettyCashItem/voucher/5
        [HttpGet("voucher/{voucherId}")]
        public async Task<ActionResult<IEnumerable<PettyCashItem>>> GetItemsByVoucherId(int voucherId)
        {
            var items = await _context.PettyCashItems
                .Where(i => i.VoucherId == voucherId)
                .ToListAsync();

            return items;
        }

        // POST: api/PettyCashItem
        [HttpPost]
        public async Task<ActionResult<PettyCashItem>> CreateItem(PettyCashItem item)
        {
            // Set timestamps
            item.CreatedAt = DateTime.UtcNow;
            item.UpdatedAt = DateTime.UtcNow;
            
            if (string.IsNullOrEmpty(item.UpdatedBy))
            {
                item.UpdatedBy = item.CreatedBy;
            }

            _context.PettyCashItems.Add(item);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetItem), new { id = item.ItemId }, item);
        }

        // PUT: api/PettyCashItem/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateItem(int id, PettyCashItem item)
        {
            if (id != item.ItemId)
            {
                return BadRequest();
            }

            item.UpdatedAt = DateTime.UtcNow;

            _context.Entry(item).State = EntityState.Modified;
            // Don't modify CreatedAt or CreatedBy
            _context.Entry(item).Property(x => x.CreatedAt).IsModified = false;
            _context.Entry(item).Property(x => x.CreatedBy).IsModified = false;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ItemExists(id))
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

        // DELETE: api/PettyCashItem/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteItem(int id)
        {
            var item = await _context.PettyCashItems.FindAsync(id);
            if (item == null)
            {
                return NotFound();
            }

            _context.PettyCashItems.Remove(item);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ItemExists(int id)
        {
            return _context.PettyCashItems.Any(e => e.ItemId == id);
        }
    }
}