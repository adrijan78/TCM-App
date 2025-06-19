using TCM_App.Models;
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

        public async Task<List<MemberTraining>> GetMemberAttendanceAndPerformance(int memberId)
        {
            if (!CheckIfMemberExists(memberId))
            {
                throw new Exception("Member not found!");
            }
            return await _memberRepository.GetMemberAttendanceAndPerformance(memberId);

        }

        public async Task<List<Member>> GetMembers(int id)
        {
            return await _memberRepository.GetMembersByClubId(id);
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
