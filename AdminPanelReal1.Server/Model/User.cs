using System.ComponentModel.DataAnnotations;

public class User
{
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string Name { get; set; }

    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    public string Password { get; set; }

    public DateTime? LastLoginTime { get; set; }
    public bool IsBlocked { get; set; }
    public bool IsDeleted { get; set; }
}
