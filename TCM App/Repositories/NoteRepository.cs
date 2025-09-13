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
        public Task<List<NoteDto>> GetNotesForMember(DateTime dateCreated, int fromMemberId, int toMemberId,int? trainingId)
         {
            var query = _context.Notes
                .Where(n =>
                n.FromMemberId == fromMemberId &&
                n.ToMemberId == toMemberId &&
                n.TrainingId == trainingId &&
                n.FromMemberId == fromMemberId).AsQueryable();


                return
                    query.ProjectTo<NoteDto>(_mapper.ConfigurationProvider).ToListAsync();
            

         }
        public  async Task AddNote(AddNoteDto noteDto)
        {
            var note= _mapper.Map<Note>(noteDto);
             await _context.Notes.AddAsync(note);
             await _context.SaveChangesAsync();

            

        }

         

    }
}
