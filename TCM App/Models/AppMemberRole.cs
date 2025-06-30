using Microsoft.AspNetCore.Identity;

namespace TCM_App.Models
{
    public class AppMemberRole:IdentityUserRole<int>
    {
        public int MemberId { get; set; }
        public Member Member { get; set; } = null!;

        public int RoleId { get; set; }
        public AppRole Role { get; set; } = null!;


    }
}
