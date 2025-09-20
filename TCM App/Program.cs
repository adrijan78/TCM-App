
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Storage.V1;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder.Extensions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.IdentityModel.Tokens;
using Stripe;
using Stripe.TestHelpers;
using System.Text;
using TCM_App.Data;
using TCM_App.EmailService.Services;
using TCM_App.EmailService.Services.Interfaces;
using TCM_App.Models;
using TCM_App.Models.Stripe;
using TCM_App.Repositories;
using TCM_App.Repositories.Interfaces;
using TCM_App.Services;
using TCM_App.Services.Interfaces;
using TCM_App.Services.StripeServices;
using TokenService = TCM_App.Services.TokenService;

namespace TCM_App
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            #region Firebase
            var config = builder.Configuration;

            // Read the credentials path from appsettings.json
            var keyPath = config["FIREBASE_CREDENTIALS:CredentialsPath"];

            if (string.IsNullOrWhiteSpace(keyPath) || !System.IO.File.Exists(keyPath))
                throw new Exception("Firebase credentials path is invalid or file not found.");

            // Create the GoogleCredential once
            var credential = GoogleCredential.FromFile(keyPath);

            // Initialize FirebaseApp with the credential
            FirebaseApp.Create(new AppOptions
            {
                Credential = credential
            });

            // Register credential instance for DI
            builder.Services.AddSingleton(credential);

            // Register StorageClient with the credential
            builder.Services.AddSingleton(s =>
            {
                var cred = s.GetRequiredService<GoogleCredential>();
                return StorageClient.Create(cred);
            });
            #endregion

            // Add services to the container.


            #region Email
            builder.Services.Configure<EmailService.GmailSettings>
                (builder.Configuration.GetSection(EmailService.GmailSettings.GmailSettingsKey));


            builder.Services.AddScoped<IEmailService, EmailServiceImpl>();
            #endregion

            builder.Services.AddControllers();


            #region DbContext
            builder.Services.AddDbContext<DataContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle

            #endregion


            builder.Services.AddCors();


            #region Our Services
            builder.Services.AddSingleton<IFirebaseStorageService, FirebaseStorageService>();
            builder.Services.AddScoped<ITokenService, TokenService>();
            builder.Services.AddScoped<IMemberService, MemberService>();
            builder.Services.AddScoped<ITrainingService, TrainingService>();
            builder.Services.AddScoped<INoteService, NoteService>();
            builder.Services.AddScoped<ICommonService, CommonService>();
            builder.Services.AddScoped<IUserClaimsPrincipalFactory<Member>, UserClaimsPrincipalFactory<Member, AppRole>>();
            #endregion

            #region Repositories
            builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
            builder.Services.AddScoped<IMemberRepository, MemberRepository>();
            builder.Services.AddScoped<ITrainingRepository, TrainingRepository>();
            builder.Services.AddScoped<INoteRepository, NoteRepository>();
            #endregion
            
            #region Authentication


            builder.Services.AddIdentityCore<Member>(options =>
            {
                options.Password.RequireDigit = true;
                options.Password.RequiredLength = 6;
                options.Password.RequireLowercase = true;
                options.Password.RequireUppercase = true;
                options.Password.RequireNonAlphanumeric = true;
            })
                .AddRoles<AppRole>()
                .AddRoleManager<RoleManager<AppRole>>()
                .AddEntityFrameworkStores<DataContext>()
                .AddDefaultTokenProviders();


            builder.Services.Configure<DataProtectionTokenProviderOptions>(options =>
               options.TokenLifespan = TimeSpan.FromHours(2));



            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    var tokenKey = builder.Configuration["TokenKey"];
                    if (tokenKey == null || tokenKey.Length < 64)
                    {
                        throw new Exception("Token key not found or is too short");
                    }
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey)),
                        ValidateIssuer = false,
                        ValidateAudience = false,
                    };

                });


            builder.Services.AddAuthorizationBuilder()
               .AddPolicy("RequireCoachRole", policy => policy.RequireRole("Coach"))
               .AddPolicy("RequireMemberAndCoachRole", policy => policy.RequireRole("Member", "Coach"));


            #endregion

            #region Stripe

            builder.Services.Configure<StripeModel>(builder.Configuration.GetSection("Stripe"));
            builder.Services.AddScoped<Stripe.CustomerService>();
            builder.Services.AddScoped<ProductService>();
            builder.Services.AddScoped<IStripeService,StripeService>();

            #endregion


            #region AutoMapper
            builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
            #endregion

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            #region CORS
            app.UseCors(x =>
            {
                x.AllowAnyOrigin();
                x.AllowAnyMethod();
                x.AllowAnyHeader();
                
            });
            #endregion 

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthentication();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
