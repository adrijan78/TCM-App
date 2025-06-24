using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using TCM_App.Data;
using TCM_App.Helpers;
using TCM_App.Models;
using TCM_App.Models.DTOs;
using TCM_App.Models.Enums;
using TCM_App.Repositories.Interfaces;

namespace TCM_App.Repositories
{
    public class MemberRepository(DataContext _context, IMapper mapper) : Repository<Member>(_context), IMemberRepository
    {
        public bool CheckIfMemberExists(int memberId)
        {
            return _context.Members.Any(x=>x.Id == memberId);
        }

        public async Task<List<MemberTraining>> GetMemberAttendanceAndPerformance(int memberId)
        {
            var membersAp = await _context.Attendaces
                .Where(a => a.MemberId == memberId)
                .Include(a => a.Training)
                .ToListAsync();

            return membersAp;
        }

        public Task<Member?> GetMemberById(int memberId)
        {
            return _context.Members
                .Include(m => m.ProfilePicture)
                .Include(m => m.Belts)
                .ThenInclude(m => m.Belt)
                .FirstOrDefaultAsync(m => m.Id == memberId);
        }

        public async Task<PagedList<MemberListDto>> GetMembersByClubId(int clubId,UserParams userParams)
        {
            var query= _context.Members.AsQueryable();

            if(userParams.Belt != null)
            {
               query= query.Where(x =>x.Belts.Any(y=>y.IsCurrentBelt && y.Belt.BeltName== userParams.Belt));
            }

            if (userParams.MemberAgeCategorie.HasValue) 
            {
                var today = DateTime.Today;
                switch (userParams.MemberAgeCategorie)
                {
                    case (int)MemberCategoryEnum.Tiny_Tots:
                        query = query.Where(x => x.DateOfBirth <= new DateTime() || CalculateAgeHelper.CalculateAge(x.DateOfBirth) >= 3);
                        break;
                    case (int)MemberCategoryEnum.Kids:
                        query = query.Where(x => CalculateAgeHelper.CalculateAge(x.DateOfBirth) <= 11 || CalculateAgeHelper.CalculateAge(x.DateOfBirth) >= 6);
                        break;
                    case (int)MemberCategoryEnum.Cadets:
                        query = query.Where(x => CalculateAgeHelper.CalculateAge(x.DateOfBirth) <= 14 || CalculateAgeHelper.CalculateAge(x.DateOfBirth) >= 12);
                        break;
                    case (int)MemberCategoryEnum.Juniors:
                        query = query.Where(x => CalculateAgeHelper.CalculateAge(x.DateOfBirth) <= 17 || CalculateAgeHelper.CalculateAge(x.DateOfBirth) >= 15);
                        break;
                    case (int)MemberCategoryEnum.Adults:
                        query = query.Select(m => new
                        {
                            Member = m,
                            Age = today.Year - m.DateOfBirth.Year- (m.DateOfBirth.Date > today.AddYears(-(today.Year - m.DateOfBirth.Year)) ? 1 : 0)
                        }).Where(x => x.Age <= 29 || x.Age >= 18).Select(x=>x.Member);
                        break;
                    case (int)MemberCategoryEnum.Seniors:
                        query = query.Where(x => CalculateAgeHelper.CalculateAge(x.DateOfBirth) >= 40);
                        break;
                }
            }
           


            return await PagedList<MemberListDto>.CreateAsync(query.ProjectTo<MemberListDto>(mapper.ConfigurationProvider), userParams.PageNumber, userParams.PageSize);
        }

        

    }
}
