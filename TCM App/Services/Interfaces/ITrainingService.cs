using TCM_App.Helpers;
using TCM_App.Models;
using TCM_App.Models.DTOs;

namespace TCM_App.Services.Interfaces
{
    public interface ITrainingService
    {
        Task<string> AddTraining(CreateTrainingDto training);
        Task<Training> UpdateTraining(Training training);
        Task<Training> DeleteTraining(Training training);
        Task<TrainingDetailsDto> GetTraining(int trainingId,int clubId);
        Task<Dictionary<int,int>> GetNumberOfTrainingsForEveryMonth(int clubId);
        Task<PagedList<TrainingDto>> GetTrainingsByClubId(int clubId, TrainingParams trainingParams);

    }
}
