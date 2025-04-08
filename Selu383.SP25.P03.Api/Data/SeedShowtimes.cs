using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Theaters;

public static class SeedShowtimes
{
    public static async Task Initialize(IServiceProvider serviceProvider)
    {
        using var context = new DataContext(serviceProvider.GetRequiredService<DbContextOptions<DataContext>>());

        if (context.Showtimes.Any())
        {
            return;
        }

        var showtimes = new List<Showtime>
        {
            new Showtime
            {
                MovieId = 1,
                HallId = 1,
                StartTime = DateTime.UtcNow.AddHours(1),
                EndTime = DateTime.UtcNow.AddHours(2),
                TicketPrice = 10.00M,
                Is3D = false
            },
            new Showtime
            {
                MovieId = 2,
                HallId = 2,
                StartTime = DateTime.UtcNow.AddHours(3),
                EndTime = DateTime.UtcNow.AddHours(4),
                TicketPrice = 12.00M,
                Is3D = true
            },
            new Showtime
            {
                MovieId = 3,
                HallId = 3,
                StartTime = DateTime.UtcNow.AddHours(5),
                EndTime = DateTime.UtcNow.AddHours(6),
                TicketPrice = 15.00M,
                Is3D = true
            }
        };

        context.Showtimes.AddRange(showtimes);
        context.SaveChanges();
    }
}