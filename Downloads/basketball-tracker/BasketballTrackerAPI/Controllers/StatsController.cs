using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BasketballTrackerAPI.Data;
using BasketballTrackerAPI.Models;

namespace BasketballTrackerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatsController : ControllerBase
    {
        private readonly BasketballTrackerContext _context;

        public StatsController(BasketballTrackerContext context)
        {
            _context = context;
        }

        // GET: api/Stats
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Stats>>> GetStats([FromQuery] int? playerId, [FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            var query = _context.Stats
                .Include(s => s.Player)
                .AsQueryable();

            if (playerId.HasValue)
            {
                query = query.Where(s => s.PlayerId == playerId.Value);
            }
            if (startDate.HasValue)
            {
                query = query.Where(s => s.Date >= startDate.Value.Date);
            }
            if (endDate.HasValue)
            {
                query = query.Where(s => s.Date <= endDate.Value.Date);
            }

            return await query
                .OrderByDescending(s => s.Date)
                .ToListAsync();
        }

        // GET: api/Stats/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Stats>> GetStats(int id)
        {
            var stats = await _context.Stats
                .Include(s => s.Player)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (stats == null)
            {
                return NotFound();
            }

            return stats;
        }

        // POST: api/Stats
        [HttpPost]
        public async Task<ActionResult<Stats>> PostStats(Stats stats)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Validate player exists
            var playerExists = await _context.Players.AnyAsync(p => p.Id == stats.PlayerId);
            if (!playerExists)
            {
                return BadRequest("Invalid PlayerId");
            }

            stats.CreatedAt = DateTime.UtcNow;
            stats.UpdatedAt = DateTime.UtcNow;

            _context.Stats.Add(stats);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetStats), new { id = stats.Id }, stats);
        }

        // PUT: api/Stats/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStats(int id, Stats stats)
        {
            if (id != stats.Id)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            stats.UpdatedAt = DateTime.UtcNow;
            _context.Entry(stats).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.Stats.AnyAsync(s => s.Id == id))
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

        // DELETE: api/Stats/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStats(int id)
        {
            var stats = await _context.Stats.FindAsync(id);
            if (stats == null)
            {
                return NotFound();
            }

            _context.Stats.Remove(stats);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
