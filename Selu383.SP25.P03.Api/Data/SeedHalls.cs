using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Theaters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public static class SeedHalls
{
    public static async Task Initialize(IServiceProvider serviceProvider)
    {
        // Resolve the DataContext from the service provider
        using (var context = serviceProvider.GetRequiredService<DataContext>())
        {
            // If there are already halls in the database, skip seeding
            if (context.Halls.Any())
            {
                return;
            }

            // Create halls for two theaters, each with multiple halls (doubling the halls)
            var halls = new List<Hall>
            {
                // Theater 1
                new Hall { HallNumber = 1, TheaterId = 1, Capacity = 150, ScreenType = "Standard" },
                new Hall { HallNumber = 2, TheaterId = 1, Capacity = 200, ScreenType = "3D" },
                new Hall { HallNumber = 3, TheaterId = 1, Capacity = 175, ScreenType = "IMAX" },
                new Hall { HallNumber = 4, TheaterId = 1, Capacity = 220, ScreenType = "Dolby" },

                // Theater 2
                new Hall { HallNumber = 1, TheaterId = 2, Capacity = 100, ScreenType = "IMAX" },
                new Hall { HallNumber = 2, TheaterId = 2, Capacity = 120, ScreenType = "Standard" },
                new Hall { HallNumber = 3, TheaterId = 2, Capacity = 150, ScreenType = "4D" },
                new Hall { HallNumber = 4, TheaterId = 2, Capacity = 180, ScreenType = "Standard" }
            };

            // Add halls to the context and save changes
            await context.Halls.AddRangeAsync(halls);
            await context.SaveChangesAsync();
        }
    }
}