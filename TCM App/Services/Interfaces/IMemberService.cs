using TCM_App.Helpers;
using TCM_App.Models;
using TCM_App.Models.DTOs;

namespace TCM_App.Services.Interfaces
{
    public interface IMemberService
    {
        Task<Member> AddMember(Member member);
        Task DeleteMember(Member member);
        Task<Member> GetMember(int id);

        Task<PagedList<MemberListDto>> GetMembers(int id,UserParams userParams);
        Task UpdateMember(Member member);

        Task<List<MemberTraining>> GetMemberAttendanceAndPerformance(int member);

    }
}
