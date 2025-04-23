using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Features.Reviews;

namespace Selu383.SP25.P03.Api.Data
{
    public static class SeedReviews
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using (var context = new DataContext(serviceProvider.GetRequiredService<DbContextOptions<DataContext>>()))
            {
                if (context.Reviews.Any())
                {
                    return;
                }

                context.Reviews.AddRange(
                    new ReviewGetDto
                    {
                        UserId = 1,
                        review = "Great movie experience! Loved the seats.",
                        Rating = 5
                    },
                    new ReviewGetDto
                    {
                        UserId = 2,
                        review = "Sound quality was amazing, but the popcorn was stale.",
                        Rating = 4
                    },
                    new ReviewGetDto
                    {
                        UserId = 3,
                        review = "Decent theater, but the staff was not very friendly.",
                        Rating = 3
                    },
                    new ReviewGetDto
                    {
                        UserId = 1,
                        review = "The theater was too crowded and noisy.",
                        Rating = 2
                    }
                );

                context.SaveChanges();
            }
        }
    }
}
