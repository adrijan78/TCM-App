using TCM_App.Models;
using TCM_App.Models.DTOs;

namespace TCM_App.Repositories.Interfaces
{
    public interface INoteRepository : IRepository<Note>
    {
        Task<List<NoteDto>> GetNotesForMember(DateTime dateCreated, int fromMemberId, int toMemberId, bool createdForTraining);
        void AddNote(AddNoteDto note);
    }
}
