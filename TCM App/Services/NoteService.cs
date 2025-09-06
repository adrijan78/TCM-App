using TCM_App.Models.DTOs;
using TCM_App.Repositories.Interfaces;
using TCM_App.Services.Interfaces;

namespace TCM_App.Services
{
    public class NoteService(INoteRepository _noteRepository,IMemberService _memberService) : INoteService
    {

        public Task<List<NoteDto>> GetNotesForMember(DateTime dateCreated, int fromMemberId, int toMemberId, bool createdForTraining)
        {
            return _noteRepository.GetNotesForMember(dateCreated, fromMemberId, toMemberId, createdForTraining);
        }
        public void AddNotes(AddNoteDto note)
        {
            var memId = _memberService.GetMember(note.ToMemberId);
            if(memId != null)
            {

                _noteRepository.AddNote(note);

            }
            else
            {
                throw new Exception("Членот за кој сакате да креирате белешка не постои");
            }
        }
    }
}
