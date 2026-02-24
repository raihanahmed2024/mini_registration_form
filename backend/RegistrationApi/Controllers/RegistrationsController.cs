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

            return Created($"/api/Registrations/{entity.Id}", entity);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _service.GetAsync();
            return Ok(list);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var registration = await _service.GetByIdAsync(id);
            if (registration == null)
            {
                return NotFound();
            }
            return Ok(registration);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] RegistrationCreateDto dto)
        {
            var existingRegistration = await _service.GetByIdAsync(id);
            if (existingRegistration == null)
            {
                return NotFound();
            }

            if (dto.DateOfBirth >= DateTime.UtcNow.Date)
            {
                return BadRequest(new
                {
                    message = "Validation failed",
                    errors = new { DateOfBirth = "Date of birth must be in the past" }
                });
            }

            existingRegistration.FirstName = dto.FirstName;
            existingRegistration.LastName = dto.LastName;
            existingRegistration.DateOfBirth = dto.DateOfBirth;
            existingRegistration.Email = dto.Email;
            existingRegistration.Phone = dto.Phone;
            existingRegistration.City = dto.City;
            existingRegistration.UpdatedAt = DateTime.UtcNow;

            await _service.UpdateAsync(id, existingRegistration);

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var existingRegistration = await _service.GetByIdAsync(id);
            if (existingRegistration == null)
            {
                return NotFound();
            }

            await _service.DeleteAsync(id);

            return NoContent();
        }
    }
}