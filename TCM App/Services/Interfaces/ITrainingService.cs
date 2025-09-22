using TCM_App.Helpers;
using TCM_App.Models;
using TCM_App.Models.DTOs;

namespace TCM_App.Services.Interfaces
{
    public interface ITrainingService
    {
        Task<string> AddTraining(CreateTrainingDto training);
        Task<int> UpdateTraining(UpdateTrainingDto training);
        Task<TrainingDetailsDto> GetTraining(int trainingId, bool includeAllMembers, int? memberId = null);
        Task<Dictionary<int,int>> GetNumberOfTrainingsForEveryMonth(int clubId, int year);

        Task<Dictionary<int, int>> GetNumberOfAttendedMemberTrainingsForEveryMonth(int clubId, int year, int memberId);

        Task<List<TrainingDetailsDto>> GetTrainingsForSpecificMonth(int month);
        Task<PagedList<TrainingDto>> GetTrainingsByClubId(int clubId, TrainingParams trainingParams);

        Task<TrainingEditDto> GetTrainingForUpdate(int id);

        Task<int> DeleteTraining(int id);

    }
}
