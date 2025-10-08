using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProgressController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ProgressController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Progress>>> GetProgress()
    {
        return await _context.Progress
            .Include(p => p.User)
            .Include(p => p.Lesson)
            .ToListAsync();
    }

    [HttpGet("user/{userId}")]
    public async Task<ActionResult<IEnumerable<Progress>>> GetProgressByUser(int userId)
    {
        var progress = await _context.Progress
            .Include(p => p.User)
            .Include(p => p.Lesson)
            .Where(p => p.UserId == userId)
            .ToListAsync();

        if (progress == null || !progress.Any())
        {
            return NotFound();
        }

        return progress;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Progress>> GetProgress(int id)
    {
        var progress = await _context.Progress
            .Include(p => p.User)
            .Include(p => p.Lesson)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (progress == null)
        {
            return NotFound();
        }

        return progress;
    }

    [HttpPost]
    public async Task<ActionResult<Progress>> PostProgress(Progress progress)
    {
        if (progress.Completed)
        {
            progress.CompletedAt = DateTime.UtcNow;
        }

        _context.Progress.Add(progress);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetProgress), new { id = progress.Id }, progress);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutProgress(int id, Progress progress)
    {
        if (id != progress.Id)
        {
            return BadRequest();
        }

        if (progress.Completed && !_context.Progress.Any(p => p.Id == id && p.Completed))
        {
            progress.CompletedAt = DateTime.UtcNow;
        }

        _context.Entry(progress).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!ProgressExists(id))
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

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProgress(int id)
    {
        var progress = await _context.Progress.FindAsync(id);
        if (progress == null)
        {
            return NotFound();
        }

        _context.Progress.Remove(progress);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool ProgressExists(int id)
    {
        return _context.Progress.Any(e => e.Id == id);
    }
}
