﻿using Selu383.SP25.P03.Api.Features.Users;

namespace Selu383.SP25.P03.Api.Features.Reviews
{
    public class Review
    {
        public int Id { get; set; }
        public string review { get; set; }
        public int Rating { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }

        //public Movie Movie { get; set; }
        //public int MovieId { get; set; }
    }
}
