using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class AddStartedAtAndNullableTeacherId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "StartedAt",
                table: "StudentPracticeMaterials",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "TeacherId",
                table: "DigitalLibraryAssignments",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.UpdateData(
                table: "Admins",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 17, 1, 15, 26, 321, DateTimeKind.Utc).AddTicks(8870), new DateTime(2025, 10, 17, 1, 15, 26, 321, DateTimeKind.Utc).AddTicks(8870) });

            migrationBuilder.UpdateData(
                table: "Parents",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 17, 1, 15, 26, 321, DateTimeKind.Utc).AddTicks(8850), new DateTime(2025, 10, 17, 1, 15, 26, 321, DateTimeKind.Utc).AddTicks(8850) });

            migrationBuilder.UpdateData(
                table: "Students",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 17, 1, 15, 26, 321, DateTimeKind.Utc).AddTicks(8770), new DateTime(2025, 10, 17, 1, 15, 26, 321, DateTimeKind.Utc).AddTicks(8770) });

            migrationBuilder.UpdateData(
                table: "Students",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 17, 1, 15, 26, 321, DateTimeKind.Utc).AddTicks(8790), new DateTime(2025, 10, 17, 1, 15, 26, 321, DateTimeKind.Utc).AddTicks(8790) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 10, 17, 1, 15, 26, 321, DateTimeKind.Utc).AddTicks(8270));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 10, 17, 1, 15, 26, 321, DateTimeKind.Utc).AddTicks(8270));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 10, 17, 1, 15, 26, 321, DateTimeKind.Utc).AddTicks(8280));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 10, 17, 1, 15, 26, 321, DateTimeKind.Utc).AddTicks(8280));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2025, 10, 17, 1, 15, 26, 321, DateTimeKind.Utc).AddTicks(8280));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "StartedAt",
                table: "StudentPracticeMaterials");

            migrationBuilder.AlterColumn<int>(
                name: "TeacherId",
                table: "DigitalLibraryAssignments",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "Admins",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 17, 1, 7, 34, 103, DateTimeKind.Utc).AddTicks(860), new DateTime(2025, 10, 17, 1, 7, 34, 103, DateTimeKind.Utc).AddTicks(860) });

            migrationBuilder.UpdateData(
                table: "Parents",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 17, 1, 7, 34, 103, DateTimeKind.Utc).AddTicks(850), new DateTime(2025, 10, 17, 1, 7, 34, 103, DateTimeKind.Utc).AddTicks(850) });

            migrationBuilder.UpdateData(
                table: "Students",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 17, 1, 7, 34, 103, DateTimeKind.Utc).AddTicks(810), new DateTime(2025, 10, 17, 1, 7, 34, 103, DateTimeKind.Utc).AddTicks(810) });

            migrationBuilder.UpdateData(
                table: "Students",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 10, 17, 1, 7, 34, 103, DateTimeKind.Utc).AddTicks(820), new DateTime(2025, 10, 17, 1, 7, 34, 103, DateTimeKind.Utc).AddTicks(820) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 10, 17, 1, 7, 34, 103, DateTimeKind.Utc).AddTicks(700));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 10, 17, 1, 7, 34, 103, DateTimeKind.Utc).AddTicks(700));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2025, 10, 17, 1, 7, 34, 103, DateTimeKind.Utc).AddTicks(700));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2025, 10, 17, 1, 7, 34, 103, DateTimeKind.Utc).AddTicks(700));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2025, 10, 17, 1, 7, 34, 103, DateTimeKind.Utc).AddTicks(700));
        }
    }
}
