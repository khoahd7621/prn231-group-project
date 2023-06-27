using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessObject.Migrations
{
    /// <inheritdoc />
    public partial class DHungUpdateDBTakeLeave : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Date",
                table: "TakeLeaves",
                newName: "StartDate");

            migrationBuilder.AlterColumn<int>(
                name: "Type",
                table: "TakeLeaves",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<int>(
                name: "Category",
                table: "TakeLeaves",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "EndDate",
                table: "TakeLeaves",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "LeaveDays",
                table: "TakeLeaves",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Category",
                table: "TakeLeaves");

            migrationBuilder.DropColumn(
                name: "EndDate",
                table: "TakeLeaves");

            migrationBuilder.DropColumn(
                name: "LeaveDays",
                table: "TakeLeaves");

            migrationBuilder.RenameColumn(
                name: "StartDate",
                table: "TakeLeaves",
                newName: "Date");

            migrationBuilder.AlterColumn<string>(
                name: "Type",
                table: "TakeLeaves",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");
        }
    }
}
