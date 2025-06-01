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

        public async Task<List<Member>> GetMembersByClubId(int clubId)
        {
            return await _context.Members
                .Where(m => m.ClubId == clubId)
                .Include(m => m.ProfilePicture)
                .ToListAsync();
        }

    }
}
