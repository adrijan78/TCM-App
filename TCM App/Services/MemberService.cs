using TCM_App.Helpers;
using TCM_App.Models;
using TCM_App.Models.DTOs;
using TCM_App.Repositories.Interfaces;
using TCM_App.Services.Interfaces;

namespace TCM_App.Services
{
    public class MemberService(IMemberRepository _memberRepository) : IMemberService
    {
        public Task<Member> AddMember(Member member)
        {
            var existingMember = _memberRepository.CheckIfMemberExists(member.Id);
            if (existingMember)
            {
                throw new Exception("Member already exists!");
            }

            //Implement AutoMapper or manual mapping here if needed

            return null;

        }

        public Task DeactivateMember(int memberId)
        {
           return _memberRepository.DeactivateMember(memberId);
        }

        public Task DeleteMember(Member member)
        {
            throw new NotImplementedException();
        }

        public async Task<Member> GetMember(int id)
        {
            var member = await _memberRepository.GetMemberById(id);
            if (member == null)
            {
                throw new Exception("Member not found!");
            }
            return member;
        }

        public async Task<PagedList<MemberTrainingDto>> GetMemberAttendanceAndPerformance(int memberId, UserParams userParams)
        {
            if (!CheckIfMemberExists(memberId))
            {
                throw new Exception("Member not found!");
            }
            return await _memberRepository.GetMemberAttendanceAndPerformance(memberId,userParams);

        }

        public async Task<PagedList<MemberListDto>> GetMembers(int id, UserParams userParams)
        {
            return await _memberRepository.GetMembersByClubId(id,userParams);
        }

        public Task UpdateMember(Member member)
        {
            throw new NotImplementedException();
        }

        private bool CheckIfMemberExists(int memberId)
        {
            return _memberRepository.CheckIfMemberExists(memberId);
        }
    }
}
