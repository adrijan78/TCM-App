using AutoMapper;
using TCM_App.Helpers;
using TCM_App.Models;
using TCM_App.Models.DTOs;
using TCM_App.Repositories.Interfaces;
using TCM_App.Services.Interfaces;

namespace TCM_App.Services
{
    public class MemberService(IMemberRepository _memberRepository, IFirebaseStorageService
        _firebaseStorageService, IRepository<Photo> _photoRepository, IMapper mapper) : IMemberService
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
            return await _memberRepository.GetMemberAttendanceAndPerformance(memberId, userParams);

        }

        public async Task<PagedList<MemberListDto>> GetMembers(int id, UserParams userParams)
        {
            return await _memberRepository.GetMembersByClubId(id, userParams);
        }

        public async Task UpdateMember(int id, MemberEditDto memberDto)
        {
            var member = await _memberRepository.GetMemberById(id);
            if (member == null)
            {
                throw new Exception("Member not found!");
            }



            if (memberDto.NewPhoto != null)
            {

                var result = await _firebaseStorageService.UploadAvatarFileAsync(memberDto.NewPhoto, id);

                if (result != null && result.Length > 0)
                {
                    var existingPhoto = member.ProfilePicture ?? null;
                    if (existingPhoto != null)
                    {
                        existingPhoto.Url = result;

                    }
                    else
                    {

                        var photo = new Photo
                        {
                            Url = result,
                            PublicId = id.ToString(),
                            MemberId = id,
                            Member = member
                        };

                        await _photoRepository.AddAsync(photo);
                        existingPhoto = _photoRepository.Query().FirstOrDefault(x => x.MemberId == id);
                    }

                }



                else
                {
                    throw new Exception("Failed to upload profile picture.");
                }


            }
            member.FirstName = memberDto.FirstName;
            member.LastName = memberDto.LastName;
            member.DateOfBirth = memberDto.DateOfBirth;
            member.Height = memberDto.Height;
            member.Weight = memberDto.Weight;
            member.IsActive = memberDto.IsActive.HasValue ? memberDto.IsActive.Value : false;
            member.IsCoach = memberDto.IsCoach.HasValue ? memberDto.IsCoach.Value : false;


            _memberRepository.UpdateAsync(member);

            await _memberRepository.SaveChangesAsync();
        }

        private bool CheckIfMemberExists(int memberId)
        {
            return _memberRepository.CheckIfMemberExists(memberId);
        }
    }
}
