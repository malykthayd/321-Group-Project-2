using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BasketballTrackerAPI.Migrations
{
    /// <inheritdoc />
    public partial class RemovePhotoUrlFromPlayer : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PhotoUrl",
                table: "Players");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PhotoUrl",
                table: "Players",
                type: "TEXT",
                maxLength: 500,
                nullable: true);
        }
    }
}
