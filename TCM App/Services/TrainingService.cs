using Microsoft.EntityFrameworkCore;
using TCM_App.Helpers;
using TCM_App.Models;
using TCM_App.Models.DTOs;
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

        public async Task<TrainingDetailsDto> GetTraining(int trainingId, int clubId)
        {
            return await _trainingRepository.GetTraining(trainingId);
        }

        public async Task<PagedList<TrainingDto>> GetTrainingsByClubId(int clubId, TrainingParams trainingParams)
        {
            return await _trainingRepository.GetTrainingsByClubId(clubId, trainingParams);
        }

        public Task<Training> UpdateTraining(Training training)
        {
            throw new NotImplementedException();
        }
    }
}
