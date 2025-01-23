using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

public class UserExistsAndNotBlockedMiddleware
{
    private readonly RequestDelegate _next;

    public UserExistsAndNotBlockedMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, ApplicationDbContext dbContext)
    {
        var userIdClaim = context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!string.IsNullOrEmpty(userIdClaim) && int.TryParse(userIdClaim, out var userId))
        {
            var user = await dbContext.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null || user.IsBlocked || user.IsDeleted)
            {
                context.Response.Redirect("/login");
                return;
            }
        }

        await _next(context);
    }
}
