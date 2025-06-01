using TCM_App.Models;

namespace TCM_App.Repositories.Interfaces
{
    public interface IMemberRepository : IRepository<Member>
    {
        bool CheckIfMemberExists(int memberId);
        Task <List<Member>> GetMembersByClubId(int clubId);
    }
}
