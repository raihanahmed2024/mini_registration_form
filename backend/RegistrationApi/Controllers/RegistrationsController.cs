using Microsoft.AspNetCore.Mvc;
using RegistrationApi.DTOs;
using RegistrationApi.Models;
using RegistrationApi.Services;

namespace RegistrationApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RegistrationsController : ControllerBase
    {
        private readonly RegistrationService _service;

        public RegistrationsController(RegistrationService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] RegistrationCreateDto dto)
        {
            if (dto.DateOfBirth >= DateTime.UtcNow.Date)
            {
                return BadRequest(new
                {
                    message = "Validation failed",
                    errors = new { DateOfBirth = "Date of birth must be in the past" }
                });
            }

            var entity = new Registration
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                DateOfBirth = dto.DateOfBirth,
                Email = dto.Email,
                Phone = dto.Phone,
                City = dto.City,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _service.CreateAsync(entity);

            return CreatedAtAction(nameof(GetAll), new { id = entity.Id }, entity);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _service.GetAsync();
            return Ok(list);
        }
    }
}