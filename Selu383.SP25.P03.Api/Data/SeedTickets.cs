using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Theaters;

public static class SeedTickets
{
    public static async Task Initialize(IServiceProvider serviceProvider)
    {
        using var context = new DataContext(serviceProvider.GetRequiredService<DbContextOptions<DataContext>>());

        if (context.Tickets.Any())
        {
            return;
        }

        if (!context.Showtimes.Any())
        {
            Console.WriteLine("❌ No showtimes found. Cannot seed tickets.");
            return;
        }


        context.Tickets.AddRange(
            new Ticket
            {
                ShowtimeId = 1,
                UserId = 1,
                PurchaseDate = DateTime.UtcNow.AddDays(-5),
                SeatNumber = "A1",
                Price = 10.00m,
                TicketType = "Standard",
                ConfirmationNumber = "TICKET1234"
            },
            new Ticket
            {
                ShowtimeId = 1,
                UserId = 2,
                PurchaseDate = DateTime.UtcNow.AddDays(-4),
                SeatNumber = "A2",
                Price = 10.00m,
                TicketType = "Standard",
                ConfirmationNumber = "TICKET5678"
            },
            new Ticket
            {
                ShowtimeId = 2,
                UserId = 3,
                PurchaseDate = DateTime.UtcNow.AddDays(-3),
                SeatNumber = "B1",
                Price = 15.00m,
                TicketType = "VIP",
                ConfirmationNumber = "TICKET9101"
            }
        );

        context.SaveChanges();
    }
}