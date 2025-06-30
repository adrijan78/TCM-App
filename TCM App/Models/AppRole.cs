using Microsoft.AspNetCore.Identity;

namespace TCM_App.Models
{
    public class AppRole:IdentityRole<int>
    {
        public List<AppMemberRole> AppMemberRoles { get; set; } = new List<AppMemberRole>();
    }
}
