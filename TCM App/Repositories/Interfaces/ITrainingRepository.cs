using TCM_App.Models;

namespace TCM_App.Repositories.Interfaces
{
    public interface ITrainingRepository : IRepository<Training>
    {
        Task<Dictionary<int, int>> GetNumberOfTrainingsForEveryMonth(int clubId);
    }
}
