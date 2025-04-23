using Selu383.SP25.P03.Api.Features.Theaters;
using Selu383.SP25.P03.Api.Features.Users;

namespace Selu383.SP25.P03.Api.Features.Reviews
{
    public class ReviewGetDto
    {
        public int Id { get; set; }
        public string review { get; set; }
        public int Rating { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }

        public Theater Theater { get; set; }
        public int TheaterId { get; set; }
    }
}
