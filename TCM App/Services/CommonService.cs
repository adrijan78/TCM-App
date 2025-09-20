using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TCM_App.Helpers;
using TCM_App.Models;
using TCM_App.Models.DTOs;
using TCM_App.Models.Enums;
using TCM_App.Repositories.Interfaces;
using TCM_App.Services.Interfaces;

namespace TCM_App.Services
{
    public class CommonService(IRepository<Belt> _beltRepository,
        ITrainingRepository _trainingRepository,
        IMemberRepository _memberRepository,
        IMapper mapper) : ICommonService
    {
        public  async Task<List<BeltDto>> GetBelts()
        {
           return await _beltRepository.Query().ProjectTo<BeltDto>(mapper.ConfigurationProvider).ToListAsync();

                
              
        }


        public async Task<List<MemberSimpleDto>> GetMembersForClub()
        {
            var members = await _memberRepository.Query()
                .Where(m => m.IsActive)
                .OrderBy(m => m.FirstName)
                .ThenBy(m => m.LastName)
                .ProjectTo<MemberSimpleDto>(mapper.ConfigurationProvider)
                .ToListAsync();

            return members;
        }

        public async Task<ClubNumbersInfoDto> GetClubNumbersInfo([FromQuery] int year, [FromQuery] int? month)
        {
            var clubNumbersInfoDto = new ClubNumbersInfoDto();
            clubNumbersInfoDto.NumberOfMembers = await _memberRepository.Query()
                .Where(x=>x.StartedOn.Year==year).CountAsync(m => m.IsActive);


            //Trainings and attencaces
            var allTrainings = new List<TrainingDetailsDto>();
            var trainings = new List<TrainingDetailsDto>();
            if (month.HasValue)
            {
                allTrainings = await _trainingRepository.Query().Where(t => t.Date.Year == year && t.Date.Month == month )
                    .ProjectTo<TrainingDetailsDto>(mapper.ConfigurationProvider).ToListAsync();
                
                trainings = allTrainings.Where(t=> t.Status == TrainingStatusesEnum.Finished.GetDescription()).ToList();

                clubNumbersInfoDto.NumberOfMembers = clubNumbersInfoDto.NumberOfMembers == 0 ? 0 : await _memberRepository.Query()
                    .Where(x => x.StartedOn.Year == year && x.StartedOn.Month <= month.Value)
                    .CountAsync(m => m.IsActive);
            }
            else
            {
                allTrainings = await _trainingRepository.Query().Where(t => t.Date.Year == year)
                    .ProjectTo<TrainingDetailsDto>(mapper.ConfigurationProvider).ToListAsync();
                trainings = allTrainings.Where(t => t.Date.Year == year && t.Status ==TrainingStatusesEnum.Finished.GetDescription()).ToList();
            }


            clubNumbersInfoDto.NumberOfTrainings =trainings.Count;

            var attendaces = trainings.Sum(t => t.MemberTrainings?.Count(x => x.Status == MemberTrainingStatusEnum.Attended)??0);

            if (attendaces>0)
            {
                double averageAttendancePerTraining = trainings.Count == 0 ? 0 : (double)attendaces / trainings.Count;

                var averageAttendance = clubNumbersInfoDto.NumberOfMembers == 0 ? 0 : (averageAttendancePerTraining / clubNumbersInfoDto.NumberOfMembers) * 100;

                clubNumbersInfoDto.Attendance = averageAttendance;
            }
            else
            {
                
                clubNumbersInfoDto.Attendance = 0.00;
            }

            //Next training
            var nextTraining = allTrainings.Where(t => t.Date > DateTime.UtcNow).OrderBy(t => t.Date).FirstOrDefault();

            clubNumbersInfoDto.NextTraining = nextTraining?.Date;

            return clubNumbersInfoDto;
        }

        public async Task<Dictionary<int, int>> GetNumberOfAttendedTrainingsForEveryMonth(int clubId, int year, int? month)
        {
            var numOfTrainingsInMonths = await _trainingRepository.Query().Include(t => t.MemberTrainings).Where(x => x.ClubId == clubId && x.Date.Year == year
            ).GroupBy(x => x.Date.Month)
               .Select(x => new { Month = x.Key, Total = x.Count() }).ToDictionaryAsync(x => x.Month, x => x.Total);


            return numOfTrainingsInMonths;

        }


        public async Task<int> GetNumberOfTrainingsForClub(int year,int? month)
        {
            if (month.HasValue)
            {
                return await _trainingRepository.Query().CountAsync(t => t.Date.Year == year && t.Date.Month == month.Value && t.Status == (int)TrainingStatusesEnum.Finished);
            }
            else
            {
                return await _trainingRepository.Query().CountAsync(t=>t.Date.Year==year && t.Status == (int)TrainingStatusesEnum.Finished);

            }

        }

        public async Task<int> GetNumberOfTrainingsForMember(int year, int? month,DateTime memberStartInClubDate) 
        {
            if (month.HasValue)
            {
                return await _trainingRepository.Query().CountAsync(t => t.Date.Year == year && t.Date.Month == month.Value && t.Date>=memberStartInClubDate && t.Status == (int)TrainingStatusesEnum.Finished);
            }
            else
            {
                return await _trainingRepository.Query().CountAsync(t => t.Date.Year == year && t.Date >= memberStartInClubDate && t.Status == (int)TrainingStatusesEnum.Finished);

            }

        }


    }
}
