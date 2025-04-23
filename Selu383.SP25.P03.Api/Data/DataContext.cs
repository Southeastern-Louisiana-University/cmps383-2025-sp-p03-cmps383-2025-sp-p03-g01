using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Selu383.SP25.P03.Api.Features.Users;
using Selu383.SP25.P03.Api.Features.Theaters;
using Selu383.SP25.P03.Api.Features.Movies;
using Selu383.SP25.P03.Api.Features.Reviews;
using Selu383.SP25.P03.Api.Features.Cart;
using System.Reflection.Emit;


namespace Selu383.SP25.P03.Api.Data
{
    public class DataContext : IdentityDbContext<User, Role, int, IdentityUserClaim<int>, UserRole, IdentityUserLogin<int>, IdentityRoleClaim<int>, IdentityUserToken<int>>
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }

        public DbSet<Theater> Theaters { get; set; }
        public DbSet<Movie> Movies{ get;  set; }
        public DbSet<Showtime> Showtimes { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<Hall> Halls { get; set; }
        public DbSet<ReviewGetDto> Reviews { get; set; }
        public DbSet<FoodMenu> FoodMenus { get; set; }
        public DbSet<FoodItem> FoodItems { get; set; }
        public DbSet<FoodMenuItem> FoodMenuItems { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<FoodCartItem> FoodCartItems { get; set; }




        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<UserRole>().HasKey(x => new { x.UserId, x.RoleId });

            builder.Entity<User>()
                .HasMany(e => e.UserRoles)
                .WithOne(x => x.User)
                .HasForeignKey(e => e.UserId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Role>()
                .HasMany(e => e.UserRoles)
                .WithOne(x => x.Role)
                .HasForeignKey(e => e.RoleId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Ticket>()
                .Property(t => t.Price)
                .HasPrecision(18, 2);

            builder.Entity<Showtime>()
                .Property(t => t.TicketPrice)
                .HasPrecision(18, 2);

            builder.Entity<FoodMenuItem>()
                .HasKey(fm => new { fm.FoodMenuId, fm.FoodItemId });

            builder.Entity<FoodMenuItem>()
                .HasOne(fm => fm.FoodMenu)
                .WithMany(m => m.FoodMenuItems)
                .HasForeignKey(fm => fm.FoodMenuId);

            builder.Entity<FoodMenuItem>()
                .HasOne(fm => fm.FoodItem)
                .WithMany()
                .HasForeignKey(fm => fm.FoodItemId);

            builder.Entity<CartItem>()
                .HasOne(c => c.Showtime)
                .WithMany()
                .HasForeignKey(c => c.ShowtimeId);

            builder.Entity<FoodCartItem>()
                .HasOne(f => f.Cart)
                .WithMany(c => c.FoodItems)
                .HasForeignKey(f => f.CartId);

            builder.Entity<FoodCartItem>()
                .HasOne(f => f.FoodItem)
                .WithMany()
                .HasForeignKey(f => f.FoodItemId);
        }
    }
}
