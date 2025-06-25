using TCM_App.Helpers;
using TCM_App.Models;
using TCM_App.Models.DTOs;

namespace TCM_App.Repositories.Interfaces
{
    public interface ITrainingRepository : IRepository<Training>
    {
        Task<Dictionary<int, int>> GetNumberOfTrainingsForEveryMonth(int clubId);
        Task<PagedList<TrainingDto>> GetTrainingsByClubId(int clubId, TrainingParams userParams);
    }
}
