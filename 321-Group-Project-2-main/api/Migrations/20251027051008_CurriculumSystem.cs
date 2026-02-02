using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class CurriculumSystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Admins",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 27, 5, 10, 7, 970, DateTimeKind.Utc).AddTicks(450), new DateTime(2025, 10, 27, 5, 10, 7, 970, DateTimeKind.Utc).AddTicks(450) });

            migrationBuilder.UpdateData(
                table: "Parents",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 27, 5, 10, 7, 970, DateTimeKind.Utc).AddTicks(450), new DateTime(2025, 10, 27, 5, 10, 7, 970, DateTimeKind.Utc).AddTicks(450) });

            migrationBuilder.UpdateData(
                table: "Students",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 27, 5, 10, 7, 970, DateTimeKind.Utc).AddTicks(450), new DateTime(2025, 10, 27, 5, 10, 7, 970, DateTimeKind.Utc).AddTicks(450) });

            migrationBuilder.UpdateData(
                table: "Students",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 27, 5, 10, 7, 970, DateTimeKind.Utc).AddTicks(450), new DateTime(2025, 10, 27, 5, 10, 7, 970, DateTimeKind.Utc).AddTicks(450) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 10, 27, 5, 10, 7, 970, DateTimeKind.Utc).AddTicks(450));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 10, 27, 5, 10, 7, 970, DateTimeKind.Utc).AddTicks(450));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 10, 27, 5, 10, 7, 970, DateTimeKind.Utc).AddTicks(450));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 10, 27, 5, 10, 7, 970, DateTimeKind.Utc).AddTicks(450));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2025, 10, 27, 5, 10, 7, 970, DateTimeKind.Utc).AddTicks(450));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Admins",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 27, 4, 37, 49, 586, DateTimeKind.Utc).AddTicks(2910), new DateTime(2025, 10, 27, 4, 37, 49, 586, DateTimeKind.Utc).AddTicks(2910) });

            migrationBuilder.UpdateData(
                table: "Parents",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 27, 4, 37, 49, 586, DateTimeKind.Utc).AddTicks(2910), new DateTime(2025, 10, 27, 4, 37, 49, 586, DateTimeKind.Utc).AddTicks(2910) });

            migrationBuilder.UpdateData(
                table: "Students",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 27, 4, 37, 49, 586, DateTimeKind.Utc).AddTicks(2910), new DateTime(2025, 10, 27, 4, 37, 49, 586, DateTimeKind.Utc).AddTicks(2910) });

            migrationBuilder.UpdateData(
                table: "Students",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 27, 4, 37, 49, 586, DateTimeKind.Utc).AddTicks(2910), new DateTime(2025, 10, 27, 4, 37, 49, 586, DateTimeKind.Utc).AddTicks(2910) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 10, 27, 4, 37, 49, 586, DateTimeKind.Utc).AddTicks(2910));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 10, 27, 4, 37, 49, 586, DateTimeKind.Utc).AddTicks(2910));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 10, 27, 4, 37, 49, 586, DateTimeKind.Utc).AddTicks(2910));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 10, 27, 4, 37, 49, 586, DateTimeKind.Utc).AddTicks(2910));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2025, 10, 27, 4, 37, 49, 586, DateTimeKind.Utc).AddTicks(2910));
        }
    }
}
