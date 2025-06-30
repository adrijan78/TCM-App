using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using TCM_App.Data;
using TCM_App.Models;
using TCM_App.Models.DTOs;
using TCM_App.Repositories.Interfaces;

namespace TCM_App.Repositories
{
    public class NoteRepository(DataContext _context,IMapper _mapper) : Repository<Note>(_context), INoteRepository
    {
         public Task<List<NoteDto>> GetNotesForMember(DateTime dateCreated, int fromMemberId, int toMemberId,bool createdForTraining)
         {
            var query = _context.Notes
                .Where(n => n.CreatedAt == dateCreated &&
                n.FromMemberId == fromMemberId && n.ToMemberId == toMemberId).AsQueryable();

            if (createdForTraining)
            {
                query = query.Where(n => n.CreatedAt == dateCreated &&
                n.FromMemberId == fromMemberId && n.ToMemberId == toMemberId && n.CreatedForTraining == createdForTraining);
            }

                return
                    query.ProjectTo<NoteDto>(_mapper.ConfigurationProvider).ToListAsync();
            

         }

    }
}
