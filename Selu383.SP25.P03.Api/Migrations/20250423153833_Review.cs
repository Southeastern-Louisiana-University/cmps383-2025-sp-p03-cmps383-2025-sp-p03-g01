using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Selu383.SP25.P03.Api.Migrations
{
    /// <inheritdoc />
    public partial class Review : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TheaterId",
                table: "Reviews",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_TheaterId",
                table: "Reviews",
                column: "TheaterId");

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_Theaters_TheaterId",
                table: "Reviews",
                column: "TheaterId",
                principalTable: "Theaters",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_Theaters_TheaterId",
                table: "Reviews");

            migrationBuilder.DropIndex(
                name: "IX_Reviews_TheaterId",
                table: "Reviews");

            migrationBuilder.DropColumn(
                name: "TheaterId",
                table: "Reviews");
        }
    }
}
