using BusinessObject;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.OData;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OData.ModelBuilder;
using Microsoft.OpenApi.Models;
using Repositories;
using Repositories.Impl;
using System.Text;

// Config OData
var builder = WebApplication.CreateBuilder(args);
var modelBuilder = new ODataConventionModelBuilder();
modelBuilder.EntitySet<Employee>("Employee");
modelBuilder.EntitySet<Employee>("SpecificEmployee");
modelBuilder.EntitySet<Position>("Position");
modelBuilder.EntitySet<Level>("Level");
modelBuilder.EntitySet<Contract>("Contract");
modelBuilder.EntitySet<Attendance>("Attendance");
modelBuilder.EntitySet<PayRoll>("PayRoll");
modelBuilder.EntitySet<TakeLeave>("TakeLeave");

// Config CORS
builder.Services.AddCors(option =>
{
    option.AddDefaultPolicy(p =>
            p.WithOrigins(
                "http://127.0.0.1:5173",
                "http://localhost:5173"
            ).SetIsOriginAllowedToAllowWildcardSubdomains()
                .AllowAnyHeader()
                .AllowAnyMethod());
});

// Add services to the container.
builder.Services.AddTransient<ITakeLeaveRepository, TakeLeaveRepository>();
builder.Services.AddTransient<IPayrollRepository, PayrollRepository>();
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "WebAPI", Version = "v1" });
    var securityScheme = new OpenApiSecurityScheme
    {
        Name = "JWT Authentication",
        Description = "Enter JWT Bearer token only",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        Reference = new OpenApiReference
        {
            Id = JwtBearerDefaults.AuthenticationScheme,
            Type = ReferenceType.SecurityScheme
        }
    };
    c.DescribeAllParametersInCamelCase();
    c.AddSecurityDefinition(securityScheme.Reference.Id, securityScheme);
    c.AddSecurityRequirement(new OpenApiSecurityRequirement { { securityScheme, new string[] { } } });
});

builder.Services.AddAuthentication().AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        ValidateAudience = false,
        ValidateIssuer = false,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration.GetSection("JWT:Token").Value!))
    };
});

builder.Services.AddControllers().AddOData(
    options => options.Select().Filter().OrderBy().Expand().Count().SetMaxTop(null).AddRouteComponents(
        "odata",
        modelBuilder.GetEdmModel()));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseODataBatching();

app.UseRouting();

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
