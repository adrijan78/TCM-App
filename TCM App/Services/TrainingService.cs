using TCM_App.Models;
using TCM_App.Repositories.Interfaces;
using TCM_App.Services.Interfaces;

namespace TCM_App.Services
{
    public class TrainingService(ITrainingRepository _trainingRepository) : ITrainingService
    {

        public Task<Training> AddTraining(Training training)
        {
            throw new NotImplementedException();
        }

        public Task<Training> DeleteTraining(Training training)
        {
            throw new NotImplementedException();
        }

        public async Task<Dictionary<int, int>> GetNumberOfTrainingsForEveryMonth(int clubId)
        {
           return await _trainingRepository.GetNumberOfTrainingsForEveryMonth(clubId);
        }

        public Task<Training> GetTraining(int trainingId, int clubId)
        {
            throw new NotImplementedException();
        }

        public Task<List<Training>> GetTrainings(int clubId)
        {
            throw new NotImplementedException();
        }

        public Task<Training> UpdateTraining(Training training)
        {
            throw new NotImplementedException();
        }
    }
}
