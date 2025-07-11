﻿using TCM_App.Helpers;
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
        
        Task DeactivateMember(int memberId);

    }
}
