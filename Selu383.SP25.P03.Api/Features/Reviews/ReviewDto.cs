using Selu383.SP25.P03.Api.Features.Theaters;
using Selu383.SP25.P03.Api.Features.Users;

namespace Selu383.SP25.P03.Api.Features.Reviews
{
    public class ReviewDto
    {
        public int Id { get; set; }
        public string review { get; set; }
        public int Rating { get; set; }
        public UserDto User { get; set; }
        public TheaterDto Theater { get; set; }
    }

    public class CreateReviewDto
    {
        public int Id { get; set; }
        public string review { get; set; }
        public int Rating { get; set; }
        public int UserId { get; set; }
        public int TheaterId { get; set; }
    }

    public class UpdateReviewDto
    {
        public string review { get; set; }
        public int Rating { get; set; }
    }
}
