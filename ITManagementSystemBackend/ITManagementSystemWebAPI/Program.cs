using BusinessObject;
using Microsoft.AspNetCore.OData;
using Microsoft.OData.ModelBuilder;

// Config OData
var builder = WebApplication.CreateBuilder(args);
var modelBuilder = new ODataConventionModelBuilder();
modelBuilder.EntitySet<Employee>("Employee");
modelBuilder.EntitySet<Position>("Position");
modelBuilder.EntitySet<Level>("Level");
modelBuilder.EntitySet<Contract>("Contract");
modelBuilder.EntitySet<Attendance>("Attendance");
//modelBuilder.EntitySet<PayRoll>("PayRoll");
//modelBuilder.EntitySet<TakeLeave>("TakeLeave");

// Config CORS
builder.Services.AddCors(option =>
{
    option.AddDefaultPolicy(p =>
            p.WithOrigins("http://127.0.0.1:5173")
                .AllowAnyHeader()
                .AllowAnyMethod());
});

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
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
app.UseHttpsRedirection();
app.UseRouting();

app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.Run();
