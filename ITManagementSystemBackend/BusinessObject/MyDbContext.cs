﻿using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObject
{
    public class MyDbContext:DbContext
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
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<Attendance> Attendances { get; set; }
        public virtual DbSet<BaseSalary> BaseSalaries { get; set; }
        public virtual DbSet<Contract> Contracts { get; set; }
        public virtual DbSet<Current> Currents { get; set; }
        public virtual DbSet<Level> Levels { get; set; }
        public virtual DbSet<PayRoll> Payrolls { get; set; }
        public virtual DbSet<PayRollTmp> PayrollTmps { get; set;}
        public virtual DbSet<TakeLeave> TakeLeaves { get; set;}
        public virtual DbSet<Position> Positions { get; set; }
    }
}
