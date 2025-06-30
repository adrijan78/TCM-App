using TCM_App.Models.DTOs;
using TCM_App.Repositories.Interfaces;
using TCM_App.Services.Interfaces;

namespace TCM_App.Services
{
    public class NoteService(INoteRepository _noteRepository) : INoteService
    {
        public Task<List<NoteDto>> GetNotesForMember(DateTime dateCreated, int fromMemberId, int toMemberId, bool createdForTraining)
        {
            return _noteRepository.GetNotesForMember(dateCreated, fromMemberId, toMemberId, createdForTraining);
        }
    }
}
