using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using TCM_App.Data;
using TCM_App.Helpers;
using TCM_App.Models;
using TCM_App.Models.DTOs;
using TCM_App.Models.Enums;
using TCM_App.Repositories.Interfaces;

namespace TCM_App.Repositories
{
    public class TrainingRepository(DataContext _context,IMapper mapper) : Repository<Training>(_context), ITrainingRepository
    {
        public async Task<Dictionary<int, int>> GetNumberOfTrainingsForEveryMonth(int clubId,int year)
        {
             var numOfTrainingsInMonths = await _context.Trainings.Where(x=>x.ClubId==clubId && x.Date.Year==year).GroupBy(x => x.Date.Month)
                .Select(x=>new {Month=x.Key,Total=x.Count() }).ToDictionaryAsync(x=>x.Month,x=>x.Total);

            return numOfTrainingsInMonths;

        }

        public async Task<Dictionary<int, int>> GetNumberOfAttendedMemberTrainingsForEveryMonth(int clubId, int year,int memberId)
        {
            var numOfTrainingsInMonths = await _context.Trainings.Include(t=>t.MemberTrainings).Where(x => x.ClubId == clubId && x.Date.Year == year
            && x.MemberTrainings.Any(m=>m.MemberId==memberId && m.Status == MemberTrainingStatusEnum.Attended)).GroupBy(x => x.Date.Month)
               .Select(x => new { Month = x.Key, Total = x.Count() }).ToDictionaryAsync(x => x.Month, x => x.Total);


            return numOfTrainingsInMonths;

        }


        public Task<PagedList<TrainingDto>> GetTrainingsByClubId(int clubId,TrainingParams trainingParams)
        {
            var query = _context.Trainings.Where(x=>x.ClubId==clubId).OrderByDescending(x=>x.Date).AsQueryable();
                
            if(trainingParams.SearchTerm !=null && trainingParams.SearchTerm != "")
            {
                query = query.Where(x => x.Description.Contains(trainingParams.SearchTerm));
            }


            if (trainingParams.TrainingType.HasValue)
            { 
                query=query.Where(x => (int)x.TrainingType == trainingParams.TrainingType.Value);
            }

            if(trainingParams.TrainingStatus.HasValue)
            {
                query = query.Where(x => x.Status == trainingParams.TrainingStatus.Value);
            }


            return PagedList<TrainingDto>
                .CreateAsync(query.ProjectTo<TrainingDto>(mapper.ConfigurationProvider), trainingParams.PageNumber, trainingParams.PageSize);
        }
        public async Task<List<TrainingDetailsDto>> GetTrainingsForSpecificMonth(int month)
        {
            var trainings = await _context.Trainings
                .Where(x => x.Date.Month == month)
                .ProjectTo<TrainingDetailsDto>(mapper.ConfigurationProvider)
                .ToListAsync();
            return trainings;
        }


        public async Task<TrainingEditDto> GetTrainingForUpdate(int id)
        {
            var training = await _context.Trainings.Include(t => t.MemberTrainings).FirstOrDefaultAsync(t => t.Id == id);
            if (training == null)
            {
                throw new Exception($"Training with id {id} not found");
            }
            
            var trainingDto = mapper.Map<TrainingEditDto>(training);

            return trainingDto;

        }            
        

        public async Task<TrainingDetailsDto> GetTraining(int trainingId)
        {
            var training = await _context.Trainings
                .Where(x => x.Id == trainingId)   
                .ProjectTo<TrainingDetailsDto>(mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();

            return training ?? throw new KeyNotFoundException($"Training with id {trainingId} not found.");

        }
    
    
    
        public async Task<string> CreateTraining(Training training)
        {
            await _context.AddAsync(training);
            await _context.SaveChangesAsync();
            return training.Id.ToString();
        }

        public async Task<int> UpdateTraining(UpdateTrainingDto trainingDto)
        {

           var memberTrainingDtos = trainingDto.MembersToAttend ?? new List<UpdateMemberTrainingDto>();

            var training = _context.Trainings.Include(t => t.MemberTrainings).FirstOrDefault(t => t.Id == trainingDto.Id);

            if (training == null)
            {
                throw new Exception($"Тренингoт не е пронајден");
            }

            training.Description = trainingDto.Description;
            training.Date = trainingDto.Date;
            training.Status = (int)trainingDto.Status;
            training.TrainingType = trainingDto.TrainingType;


            var existingMemberTrainings= _context.Attendaces
                .Where(mt => mt.TrainingId == training.Id)
                .ToList();

            if (existingMemberTrainings != null)
            {
                if (trainingDto.Status == TrainingStatusesEnum.Finished)
                {
                    var flag = existingMemberTrainings.Any(x=>x.Status == MemberTrainingStatusEnum.Pending);
                    if (flag)
                    {
                        throw new Exception("Не можете да го завршите тренингот бидејќи постојат членови со статус На чекање ");
                    }
                }
            }

            var toRemove = existingMemberTrainings
                .Where(mt => !memberTrainingDtos.Any(x => x.MemberId == mt.MemberId))
                .ToList();

            foreach(var mt in toRemove)
            {
              training.MemberTrainings.Remove(mt);
            }

            _context.Attendaces.RemoveRange(toRemove);


            foreach (var memberTraining in memberTrainingDtos)
            {
                var existingMemberTraining = existingMemberTrainings
                    .FirstOrDefault(mt => mt.MemberId == memberTraining.MemberId);

                if(existingMemberTraining != null)
                {
                    existingMemberTraining.Date= training.Date;
                }

                    if (existingMemberTraining == null)
                {
                    // Add new member training
                    var newMemberTraining = new MemberTraining
                    {
                        MemberId = memberTraining.MemberId,
                        TrainingId = training.Id,
                        Status = memberTraining.Status,
                        Performace = 0,
                        Date = training.Date,
                        Description = training.Description,
                    };
                    await _context.Attendaces.AddAsync(newMemberTraining);
                }
            }

            _context.Update(training);

            await _context.SaveChangesAsync();

            return training.Id;

        }

        public async Task DeleteTraining(Training t)
        {
            _context.Trainings.Remove(t);
            await _context.SaveChangesAsync();
        }
    }
}
