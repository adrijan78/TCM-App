using TCM_App.Models;

namespace TCM_App.Services.Interfaces
{
    public interface IMemberService
    {
        Task<Member> AddMember(Member member);
        Task DeleteMember(Member member);
        Task<Member> GetMember(int id);

        Task<List<Member>> GetMembers(int id);
        Task UpdateMember(Member member);

        Task<List<MemberTraining>> GetMemberAttendanceAndPerformance(int member);

    }
}
