using Microsoft.EntityFrameworkCore;
using TCM_App.Models.DTOs;
using TCM_App.Repositories.Interfaces;
using TCM_App.Services.Interfaces;

namespace TCM_App.Services
{
    public class NoteService(INoteRepository _noteRepository,IMemberService _memberService) : INoteService
    {

        public Task<List<NoteDto>> GetNotesForMember(DateTime dateCreated, int fromMemberId, int toMemberId, int? trainingId)
        {
            return _noteRepository.GetNotesForMember(dateCreated, fromMemberId, toMemberId, trainingId);
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
