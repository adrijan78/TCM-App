using TCM_App.Helpers;
using TCM_App.Models;
using TCM_App.Models.DTOs;

namespace TCM_App.Repositories.Interfaces
{
    public interface ITrainingRepository : IRepository<Training>
    {
        Task<Dictionary<int, int>> GetNumberOfTrainingsForEveryMonth(int clubId,int year);

        Task<Dictionary<int, int>> GetNumberOfAttendedMemberTrainingsForEveryMonth(int clubId, int year, int memberId);
        Task<List<TrainingDetailsDto>> GetTrainingsForSpecificMonth(int month);
        Task<PagedList<TrainingDto>> GetTrainingsByClubId(int clubId, TrainingParams userParams);
        Task<TrainingDetailsDto> GetTraining(int trainingId);

        Task<TrainingEditDto> GetTrainingForUpdate(int id);

        Task<string> CreateTraining(Training training);
        Task<int> UpdateTraining(UpdateTrainingDto trainingDto);
        Task DeleteTraining(Training training);
    }
}
