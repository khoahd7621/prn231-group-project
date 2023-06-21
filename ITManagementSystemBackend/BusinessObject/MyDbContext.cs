using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace BusinessObject
{
    public class MyDbContext : DbContext
    {
        public MyDbContext()
        {

        }
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
    }
}
