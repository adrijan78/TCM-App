using TCM_App.Helpers;
using TCM_App.Models.DTOs;
using TCM_App.Repositories.Interfaces;

namespace TCM_App.Services.Interfaces
{
    public interface INoteService
    {
       Task<List<NoteDto>> GetNotesForMember( int fromMemberId, int? toMemberId, int? trainingId);

        Task<PagedList<NoteDto>> GetClubNotes(NoteParams noteParams);
         Task AddNote(AddNoteDto noteDto);

       Task DeleteNote(int noteId);



    }
}
