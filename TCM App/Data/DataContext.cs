using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TCM_App.Models;

namespace TCM_App.Data
{
    public class DataContext 
        : IdentityDbContext<Member,AppRole,int,IdentityUserClaim<int>,
            AppMemberRole,IdentityUserLogin<int>,IdentityRoleClaim<int>,
            IdentityUserToken<int>>
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DbSet<Member> Members { get; set; }
        public DbSet<Belt> Belts { get; set; }
        public DbSet<MemberBelt> MemberBelts { get; set; }
        public DbSet<Club> Clubs { get; set; }
        public DbSet<Photo> Photos { get; set; }

        public DbSet<MemberTraining> Attendaces { get; set; }
        public DbSet<Training> Trainings { get; set; }
        public DbSet<Note> Notes { get; set; }




        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Member>()
                .HasOne(x => x.ProfilePicture)
                .WithOne(x => x.Member)
                .HasForeignKey<Photo>(x => x.MemberId);

            modelBuilder.Entity<Note>()
                .HasOne(x=>x.FromMember)
                .WithMany(x=>x.NotesSent)
                .HasForeignKey(x => x.FromMemberId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Note>()
                .HasOne(x=>x.ToMember)
                .WithMany(x => x.NotesReceived)
                .HasForeignKey(x => x.ToMemberId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<MemberTraining>()
                .HasOne(mt => mt.Training)
                .WithMany(t => t.MemberTrainings)
                .HasForeignKey(mt => mt.TrainingId)   
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<MemberTraining>()
                .HasOne(mt => mt.Member)
                .WithMany(m => m.MemberTrainings)
                .HasForeignKey(mt => mt.MemberId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Member>()
                .HasMany(m => m.MemberRoles)
                .WithOne(mr => mr.Member)
                .HasForeignKey(mr => mr.UserId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<AppRole>()
                .HasMany(m => m.AppMemberRoles)
                .WithOne(mr => mr.Role)
                .HasForeignKey(mr => mr.RoleId)
                .IsRequired()
                .OnDelete(DeleteBehavior.Cascade);



        }
    }
    
}
