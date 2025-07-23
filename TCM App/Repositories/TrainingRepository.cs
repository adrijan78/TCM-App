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
        public async Task<Dictionary<int, int>> GetNumberOfTrainingsForEveryMonth(int clubId)
        {
             var numOfTrainingsInMonths = await _context.Trainings.Where(x=>x.ClubId==clubId).GroupBy(x => x.Date.Month)
                .Select(x=>new {Month=x.Key,Total=x.Count() }).ToDictionaryAsync(x=>x.Month,x=>x.Total);

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

    }
}
