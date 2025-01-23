using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Authorize]
[Route("admin")]
public class AdminController : Controller
{
    private readonly ApplicationDbContext _context;

    public AdminController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        try
        {
            var users = await _context.Users
                .Where(u => !u.IsDeleted)
                .OrderByDescending(u => u.LastLoginTime)
                .ToListAsync();
            return Ok(users);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error fetching users.", error = ex.Message });
        }
    }

    [HttpPost("block")]
    public async Task<IActionResult> BlockUsers([FromBody] List<int> userIds)
    {
        if (userIds == null || !userIds.Any())
        {
            return BadRequest(new { message = "No users selected for blocking." });
        }

        var usersToBlock = await _context.Users.Where(u => userIds.Contains(u.Id)).ToListAsync();

        if (!usersToBlock.Any())
        {
            return BadRequest(new { message = "No matching users found." });
        }

        usersToBlock.ForEach(u => u.IsBlocked = true);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Selected users have been blocked successfully." });
    }

    [HttpPost("unblock")]
    public async Task<IActionResult> UnblockUsers([FromBody] List<int> userIds)
    {
        if (userIds == null || !userIds.Any())
        {
            return BadRequest(new { message = "No users selected for unblocking." });
        }

        var users = await _context.Users.Where(u => userIds.Contains(u.Id)).ToListAsync();

        if (!users.Any())
        {
            return BadRequest(new { message = "No matching users found." });
        }

        users.ForEach(u => u.IsBlocked = false);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Users unblocked successfully." });
    }

    [HttpPost("delete")]
    public async Task<IActionResult> DeleteUsers([FromBody] List<int> userIds)
    {
        if (userIds == null || !userIds.Any())
        {
            return BadRequest(new { message = "No users selected for deletion." });
        }

        var users = await _context.Users.Where(u => userIds.Contains(u.Id)).ToListAsync();

        if (!users.Any())
        {
            return BadRequest(new { message = "No matching users found." });
        }

        users.ForEach(u => u.IsDeleted = true);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Users deleted successfully." });
    }
}
