using Microsoft.AspNetCore.Mvc;
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
        Task UpdateMember(int id, MemberEditDto memberDto);

        Task<PagedList<MemberTrainingDto>> GetMemberAttendanceAndPerformance(int member, UserParams userParams);

        Task UpdateMemberAttendanceAndPerformace(List<UpdateMemberTrainingDto> memberTrainingDtos);

        Task<List<UpdateMemberBeltDto>> GetMemberBelts(int id);

        Task<int> AddBeltExamForMember(UpdateMemberBeltDto memberBelt);
        Task<IActionResult> DeleteBeltExamForMember(int id);


        Task DeactivateMember(int memberId);
        //Task GetMembersGroupedByBelt(UserParams userParams);
        Task<Dictionary<int, List<MemberDropdownDto>>> GetMembersGroupedByBelt();
    }
}
