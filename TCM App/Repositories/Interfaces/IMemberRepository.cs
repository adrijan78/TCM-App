using TCM_App.Helpers;
using TCM_App.Models;
using TCM_App.Models.DTOs;

namespace TCM_App.Repositories.Interfaces
{
    public interface IMemberRepository : IRepository<Member>
    {
        bool CheckIfMemberExists(int memberId);
        Task<Lookup<int, string>> GetMembersGroupedByBelt();
        Task <PagedList<MemberListDto>> GetMembersByClubId(int clubId,UserParams memberParams);
        Task<Member?> GetMemberById(int memberId);

        Task<PagedList<MemberTrainingDto>> GetMemberAttendanceAndPerformance (int member, UserParams memberParams);
        Task DeactivateMember(int memberId);
    }
}
