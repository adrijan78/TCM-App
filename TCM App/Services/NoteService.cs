using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using TCM_App.Helpers;
using TCM_App.Models;
using TCM_App.Models.DTOs;
using TCM_App.Repositories.Interfaces;
using TCM_App.Services.Interfaces;

namespace TCM_App.Services
{
    public class NoteService(INoteRepository _noteRepository, IMemberService _memberService, IMapper mapper) : INoteService
    {

        public Task<List<NoteDto>> GetNotesForMember( int fromMemberId, int? toMemberId, int? trainingId)
        {
            return _noteRepository.GetNotesForMember( fromMemberId, toMemberId, trainingId);
        }

        Task<PagedList<NoteDto>> INoteService.GetClubNotes(NoteParams noteParams)
        {
            var query = _noteRepository.Query().OrderByDescending(x => x.CreatedAt).AsQueryable();

            if (noteParams.SearchTerm != null && noteParams.SearchTerm != "")
            {
                query = query.Where(x => x.Title.Contains(noteParams.SearchTerm));
            }


            if (noteParams.Priority.HasValue)
            {
                query = query.Where(x => (int)x.Priority == noteParams.Priority.Value);
            }

            if (noteParams.ToMemberId.HasValue)
            {
                query = query.Where(x => x.ToMemberId == noteParams.ToMemberId);
            }


            return PagedList<NoteDto>
                .CreateAsync(query.ProjectTo<NoteDto>(mapper.ConfigurationProvider), noteParams.PageNumber, noteParams.PageSize);
        }


        public async Task AddNote(AddNoteDto noteDto)
        {
            var memId = await _memberService.GetMember(noteDto.ToMemberId);
            if(memId != null)
            {

                 await _noteRepository.AddNote(noteDto);

            }
            else
            {
                throw new Exception("Членот за кој сакате да креирате белешка не постои");
            }
        }


        
        public async Task DeleteNote(int noteId)
        {
            var note = await _noteRepository.Query().FirstOrDefaultAsync(n => n.Id == noteId);
            if (note != null)
            {
                _noteRepository.DeleteAsync(note);
                await _noteRepository.SaveChangesAsync();
            }
            else
            {
                throw new Exception("Белешката не постои");
            }
        }

       
    }
}
