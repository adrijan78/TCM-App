using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using TCM_App.Data;
using TCM_App.Helpers;
using TCM_App.Models;
using TCM_App.Models.DTOs;
using TCM_App.Models.Enums;
using TCM_App.Repositories.Interfaces;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace TCM_App.Repositories
{
    public class MemberRepository(DataContext _context, IMapper mapper) : Repository<Member>(_context), IMemberRepository
    {
        public bool CheckIfMemberExists(int memberId)
        {
            return _context.Members.Any(x=>x.Id == memberId);
        }

        public async Task<PagedList<MemberTrainingDto>> GetMemberAttendanceAndPerformance(int memberId, UserParams userParams)
        {
            var query =  _context.Attendaces
                .Where(a => a.MemberId == memberId)
                .OrderByDescending(x=>x.Date)
                .AsQueryable();

            return await PagedList<MemberTrainingDto>.CreateAsync(query.ProjectTo<MemberTrainingDto>(mapper.ConfigurationProvider), userParams.PageNumber, userParams.PageSize);
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

            if(userParams.SearchTerm!=null && userParams.SearchTerm !="")
            {
                query = query.Where(x => x.FirstName.Contains(userParams.SearchTerm!) 
                || x.LastName.Contains(userParams.SearchTerm!)
                || x.Email.Contains(userParams.SearchTerm!));
            }

            if(userParams.Belt != null)
            {
               query= query.Where(x =>x.Belts.Any(y=>y.IsCurrentBelt && y.Belt.BeltName== userParams.Belt));
            }

            if (userParams.MemberAgeCategorie.HasValue) 
            {
                
                switch (userParams.MemberAgeCategorie)
                {
                    case (int)MemberCategoryEnum.Tiny_Tots:
                        query = GetQueryWithAgeParams(query, 3, 5);
                        break;
                    case (int)MemberCategoryEnum.Kids:
                        query = GetQueryWithAgeParams(query, 6, 11);
                        break;
                      
                    case (int)MemberCategoryEnum.Cadets:
                        query = GetQueryWithAgeParams(query, 12, 14);
                        break;
                       
                    case (int)MemberCategoryEnum.Juniors:
                        query = GetQueryWithAgeParams(query, 15, 17);
                     
                        break;
                    case (int)MemberCategoryEnum.Adults:
                        query = GetQueryWithAgeParams(query,18,39);
                        break;
                    case (int)MemberCategoryEnum.Seniors:
                        query = GetQueryWithAgeParams(query, 40, 150);
                        break;
                }
            }
           


            return await PagedList<MemberListDto>.CreateAsync(query.ProjectTo<MemberListDto>(mapper.ConfigurationProvider), userParams.PageNumber, userParams.PageSize);
        }

        private static IQueryable<Member> GetQueryWithAgeParams(IQueryable<Member> query,int moreThan,int lessThan)
        {
            var today = DateTime.Today;
            query = query.Select(m => new
            {
                Member = m,
                Age = today.Year - m.DateOfBirth.Year
                                        - ((today.Month < m.DateOfBirth.Month || (today.Month == m.DateOfBirth.Month && today.Day < m.DateOfBirth.Day)) ? 1 : 0)
            }).Where(z => z.Age >= moreThan && z.Age <= lessThan).Select(x => x.Member);
            return query;
        }

        public Task DeactivateMember(int memberId)
        {
            Member? member = _context.Members.FirstOrDefault(x => x.Id == memberId);
            if (member == null)
            {
                throw new Exception("Member not found");
            }
            member.IsActive = false;
            _context.Members.Update(member);
            return _context.SaveChangesAsync();

        }
    }
}
