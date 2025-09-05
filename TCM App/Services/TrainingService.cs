using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TCM_App.Helpers;
using TCM_App.Models;
using TCM_App.Models.DTOs;
using TCM_App.Repositories.Interfaces;
using TCM_App.Services.Interfaces;

namespace TCM_App.Services
{
    public class TrainingService(ITrainingRepository _trainingRepository,IMapper mapper,IMemberRepository _memberRepository) : ITrainingService
    {

        public async Task<string> AddTraining(CreateTrainingDto trainingDto)
        {
          var training = mapper.Map<Training>(trainingDto);
          foreach (var memberT in trainingDto.MembersToAttend)
          {
              if(memberT != null) {
                    var existingMember = await _memberRepository.GetMemberById(memberT.MemberId);
                    var memberTraining = new MemberTraining
                    {
                        MemberId = memberT.MemberId,
                        TrainingId = training.Id,
                        Status = memberT.Status,
                        Date = training.Date,
                        Description = training.Description,
                    };
                    training.MemberTrainings.Add(memberTraining);
                }
              
          }

            return await _trainingRepository.CreateTraining(training);

        }

        public Task<Training> DeleteTraining(Training training)
        {
            throw new NotImplementedException();
        }

        public async Task<Dictionary<int, int>> GetNumberOfTrainingsForEveryMonth(int clubId,int year)
        {
           return await _trainingRepository.GetNumberOfTrainingsForEveryMonth(clubId,year);
        }

        public async Task<TrainingDetailsDto> GetTraining(int trainingId, int clubId)
        {
            return await _trainingRepository.GetTraining(trainingId);
        }

        public async Task<List<TrainingDetailsDto>> GetTrainingsForSpecificMonth(int month)
        {
            return await _trainingRepository.GetTrainingsForSpecificMonth(month);
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
