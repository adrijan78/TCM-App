using TCM_App.Models;
using TCM_App.Models.DTOs;

namespace TCM_App.Repositories.Interfaces
{
    public interface INoteRepository : IRepository<Note>
    {
        Task<List<NoteDto>> GetNotesForMember( int fromMemberId, int? toMemberId, int? trainingId);
        Task AddNote(AddNoteDto noteDto);
    }
}
