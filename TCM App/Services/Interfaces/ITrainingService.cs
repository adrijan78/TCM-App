using TCM_App.Models;

namespace TCM_App.Services.Interfaces
{
    public interface ITrainingService
    {
        Task<Training> AddTraining(Training training);
        Task<Training> UpdateTraining(Training training);
        Task<Training> DeleteTraining(Training training);
        Task<List<Training>> GetTrainings(int clubId);
        Task<Training> GetTraining(int trainingId,int clubId);
        Task<Dictionary<int,int>> GetNumberOfTrainingsForEveryMonth(int clubId);

    }
}
