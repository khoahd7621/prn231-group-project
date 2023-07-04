using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BusinessObject.Migrations
{
    /// <inheritdoc />
    public partial class Addmasterdata : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Levels",
                columns: new[] { "Id", "LevelName" },
                values: new object[,]
                {
                    { 1, "Intern" },
                    { 2, "Fresher" },
                    { 3, "Junior" },
                    { 4, "Senior" },
                    { 5, "Specialized" }
                });

            migrationBuilder.InsertData(
                table: "Positions",
                columns: new[] { "Id", "PositionName" },
                values: new object[,]
                {
                    { 1, "Software Engineering" },
                    { 2, "Business Analysis" },
                    { 3, "Automation Tester" },
                    { 4, "Project Manager" },
                    { 5, "Solution Architecture" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "CCCD", "CreatedDate", "Dob", "Email", "EmployeeCode", "EmployeeName", "Gender", "IsFirstLogin", "Password", "Phone", "Role", "Status" },
                values: new object[] { 1, "HCM", "1234567890", new DateTime(2023, 7, 4, 9, 42, 50, 17, DateTimeKind.Local).AddTicks(2517), new DateTime(2001, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "admin@projectx.com", "SD0001", "Admin", 0, true, "$2a$11$BPNLoWE0Egnxrq4xvZJ1JeME5aT92hS5L8l2FPXN9/o9Kd7As4Ute", "0792123456", 0, 0 });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Levels",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Levels",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Levels",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Levels",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Levels",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Positions",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Positions",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Positions",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Positions",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Positions",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1);
        }
    }
}
