using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

[Route("api/[controller]")]
[ApiController]
public class AccountController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AccountController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost("Register")]
    public async Task<IActionResult> Register([FromBody] User user)
    {
        if (string.IsNullOrWhiteSpace(user.Name) || string.IsNullOrWhiteSpace(user.Email) || string.IsNullOrWhiteSpace(user.Password))
            return BadRequest(new { message = "All fields are required." });

        var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == user.Email);

        if (existingUser != null && !existingUser.IsDeleted)
            return BadRequest(new { message = "Email is already registered." });

        if (existingUser != null && existingUser.IsDeleted)
        {
            existingUser.IsDeleted = false;
            existingUser.Password = user.Password;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Account re-activated." });
        }

        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Registration successful." });
    }

    [HttpPost("Login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
    {
        if (string.IsNullOrWhiteSpace(loginRequest.Email) || string.IsNullOrWhiteSpace(loginRequest.Password))
        {
            return BadRequest(new { message = "Email and password are required." });
        }

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginRequest.Email);

        if (user == null || user.Password != loginRequest.Password)
        {
            return Unauthorized(new { message = "Invalid email or password." });
        }

        if (user.IsBlocked)
        {
            return Unauthorized(new { message = "Your account is blocked." });
        }

        if (user.IsDeleted)
        {
            return Unauthorized(new { message = "Account deleted. Please re-register." });
        }

        user.LastLoginTime = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        // Set up authentication claims
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email)
        };

        var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        var principal = new ClaimsPrincipal(identity);

        // Sign in the user
        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal, new AuthenticationProperties
        {
            IsPersistent = true
        });

        return Ok(new { message = "Login successful." });
    }

    [HttpPost("Logout")]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return Ok(new { message = "Logout successful." });
    }
}
