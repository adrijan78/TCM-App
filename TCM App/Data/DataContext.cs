using Microsoft.EntityFrameworkCore;
using TCM_App.Models;

namespace TCM_App.Data
{
    public class DataContext: DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }
        public DbSet<Member> Members { get; set; }
        public DbSet<Belt> Belts { get; set; }
        public DbSet<MemberBelt> MemberBelts { get; set; }
    }
    
}
