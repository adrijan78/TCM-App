using Microsoft.AspNetCore.Identity;

namespace TCM_App.Models
{
    public class AppMemberRole:IdentityUserRole<int>
    {
        public Member Member { get; set; } = null!;

        public AppRole Role { get; set; } = null!;


    }
}
