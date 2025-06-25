using TCM_App.Helpers;
using TCM_App.Models;
using TCM_App.Models.DTOs;

namespace TCM_App.Services.Interfaces
{
    public interface ITrainingService
    {
        Task<Training> AddTraining(Training training);
        Task<Training> UpdateTraining(Training training);
        Task<Training> DeleteTraining(Training training);
        Task<Training> GetTraining(int trainingId,int clubId);
        Task<Dictionary<int,int>> GetNumberOfTrainingsForEveryMonth(int clubId);
        Task<PagedList<TrainingDto>> GetTrainingsByClubId(int clubId, TrainingParams trainingParams);

    }
}
