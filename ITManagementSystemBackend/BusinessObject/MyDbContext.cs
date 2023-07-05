using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace BusinessObject
{
    public class MyDbContext : DbContext
    {
        public MyDbContext() { }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);
            IConfigurationRoot configuration = builder.Build();
            optionsBuilder.UseSqlServer(configuration.GetConnectionString("ITManagementSystemDB"));
        }

        public virtual DbSet<Employee> Users { get; set; }
        public virtual DbSet<Attendance> Attendances { get; set; }
        public virtual DbSet<Contract> Contracts { get; set; }
        public virtual DbSet<Level> Levels { get; set; }
        public virtual DbSet<PayRoll> Payrolls { get; set; }
        public virtual DbSet<TakeLeave> TakeLeaves { get; set; }
        public virtual DbSet<Position> Positions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Level>().HasData(
                 new Level
                 {
                     Id = 1,
                     LevelName = "Intern"
                 },
                 new Level
                 {
                     Id = 2,
                     LevelName = "Fresher"
                 },
                 new Level
                 {
                     Id = 3,
                     LevelName = "Junior"
                 },
                 new Level
                 {
                     Id = 4,
                     LevelName = "Senior"
                 },
                 new Level
                 {
                     Id = 5,
                     LevelName = "Specialized"
                 }
            );
            modelBuilder.Entity<Position>().HasData(
                 new Position
                 {
                     Id = 1,
                     PositionName = "Software Engineering"
                 },
                 new Position
                 {
                     Id = 2,
                     PositionName = "Business Analysis"
                 },
                 new Position
                 {
                     Id = 3,
                     PositionName = "Automation Tester"
                 },
                 new Position
                 {
                     Id = 4,
                     PositionName = "Project Manager"
                 },
                 new Position
                 {
                     Id = 5,
                     PositionName = "Solution Architecture"
                 }
            );
            modelBuilder.Entity<Employee>().HasData(
                new Employee
                {
                    Id = 1,
                    EmployeeName = "Admin",
                    EmployeeCode = "SD0001",
                    Gender = Enum.EnumList.Gender.Male,
                    Role = Enum.EnumList.Role.Admin,
                    Dob = new DateTime(2001, 1, 1),
                    CCCD = "1234567890",
                    Address = "HCM",
                    CreatedDate = DateTime.Now,
                    Email = "admin@projectx.com",
                    Phone = "0792123456",
                    Status = Enum.EnumList.EmployeeStatus.Active,
                    IsFirstLogin = true,
                    Password = BCrypt.Net.BCrypt.HashPassword("Admin@112001")
                }
                );
        }
    }
}
