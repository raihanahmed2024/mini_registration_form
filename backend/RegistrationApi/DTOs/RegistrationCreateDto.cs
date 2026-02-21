using System.ComponentModel.DataAnnotations;

namespace RegistrationApi.DTOs
{
    public class RegistrationCreateDto
    {
        [Required, MinLength(2), MaxLength(30)]
        public string FirstName { get; set; } = null!;

        [Required, MinLength(2), MaxLength(30)]
        public string LastName { get; set; } = null!;

        [Required]
        public DateTime DateOfBirth { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; } = null!;

        [Required, RegularExpression(@"^\+?[0-9]{8,15}$")]
        public string Phone { get; set; } = null!;

        [Required]
        public string City { get; set; } = null!;
    }
}