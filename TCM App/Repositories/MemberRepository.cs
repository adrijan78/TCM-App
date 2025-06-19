using Microsoft.EntityFrameworkCore;
using TCM_App.Data;
using TCM_App.Models;
using TCM_App.Repositories.Interfaces;

namespace TCM_App.Repositories
{
    public class MemberRepository(DataContext _context) : Repository<Member>(_context), IMemberRepository
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
                .Select(a => new MemberTraining() 
                { 
                  Date = a.Date,
                  Description=a.Description,
                  MemberId = a.MemberId,
                  TrainingId = a.TrainingId,
                  Performace=a.Performace
                })
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

        public async Task<List<Member>> GetMembersByClubId(int clubId)
        {
            return await _context.Members
                .Where(m => m.ClubId == clubId)
                .Include(m => m.ProfilePicture)
                .Include(m => m.Belts)
                .ThenInclude(m=>m.Belt)
                .ToListAsync();
        }

        

    }
}
