using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Reviews;
using Selu383.SP25.P03.Api.Features.Theaters;
using Selu383.SP25.P03.Api.Features.Users;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly DataContext dataContext;

        public ReviewsController(DataContext dataContext)
        {
            this.dataContext = dataContext;
        }

        [HttpGet]
        public async Task<ActionResult<List<ReviewDto>>> GetAll()
        {
            var reviews = await dataContext.Set<ReviewGetDto>()
                .Include(x => x.User)
                .Include(x => x.Theater)
                .ToListAsync();

            return Ok(reviews.Select(x => new ReviewDto
            {
                Id = x.Id,
                review = x.review,
                Rating = x.Rating,
                User = new UserDto
                {
                    Id = x.User.Id,
                    UserName = x.User.UserName
                },
                Theater = new TheaterDto
                { 
                    Id = x.Theater.Id,
                    Name = x.Theater.Name,
                    Address = x.Theater.Address
                }
            }).ToList());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ReviewDto>> GetReviewById(int id)
        {
            var review = await dataContext.Set<ReviewGetDto>()
                .Include(x => x.User)
                .Include(x => x.Theater)
                .Where(x => x.Id == id)
                .Select(x => new ReviewDto
                {
                    Id = x.Id,
                    review = x.review,
                    Rating = x.Rating,
                    User = new UserDto
                    {
                        Id = x.User.Id,
                        UserName = x.User.UserName
                    },
                    Theater = new TheaterDto
                    {
                        Id = x.Theater.Id,
                        Name = x.Theater.Name,
                        Address = x.Theater.Address
                    }
                }).FirstOrDefaultAsync();

            if (review == null)
            {
                return NotFound();
            }

            return Ok(review);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<CreateReviewDto>> CreateReview(CreateReviewDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (dto.Rating < 1 || dto.Rating > 5)
            {
                return BadRequest("Rating must be between 1 and 5.");
            }

            if (string.IsNullOrWhiteSpace(dto.review))
            {
                return BadRequest("Review content cannot be empty.");
            }

            var review = new ReviewGetDto
            {
                UserId = dto.UserId,
                TheaterId = dto.TheaterId,
                review = dto.review,
                Rating = dto.Rating
            };

            dataContext.Set<ReviewGetDto>().Add(review);
            await dataContext.SaveChangesAsync();
            return CreatedAtAction(nameof(GetReviewById), new { id = review.Id }, review);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<UpdateReviewDto>> UpdateReview(int id, UpdateReviewDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var review = await dataContext.Set<ReviewGetDto>().FirstOrDefaultAsync(x => x.Id == id);

            if (review == null)
            {
                return NotFound();
            }

            var currentUser = await dataContext.Set<User>().FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);
            if (currentUser == null)
            {
                return Unauthorized();
            }

            if (review.UserId != currentUser.Id && !User.IsInRole(UserRoleNames.Admin))
            {
                return Forbid();
            }

            if (string.IsNullOrWhiteSpace(dto.review))
            {
                return BadRequest("Review content cannot be empty.");
            }

            if (dto.Rating < 1 || dto.Rating > 5)
            {
                return BadRequest("Rating must be between 1 and 5.");
            }

            review.review = dto.review;
            review.Rating = dto.Rating;

            await dataContext.SaveChangesAsync();

            return Ok(dto);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult> DeleteReview(int id)
        {
            var review = await dataContext.Set<ReviewGetDto>().FirstOrDefaultAsync(x => x.Id == id);

            if (review == null)
            {
                return NotFound();
            }

            var currentUser = await dataContext.Set<User>().FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);
            if (currentUser == null)
            {
                return Unauthorized();
            }

            if (review.UserId != currentUser.Id && !User.IsInRole(UserRoleNames.Admin))
            {
                return Forbid();
            }

            dataContext.Set<ReviewGetDto>().Remove(review);
            await dataContext.SaveChangesAsync();

            return Ok();
        }
    }
}
