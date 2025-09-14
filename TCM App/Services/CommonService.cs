using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using TCM_App.Models;
using TCM_App.Models.DTOs;
using TCM_App.Repositories.Interfaces;
using TCM_App.Services.Interfaces;

namespace TCM_App.Services
{
    public class CommonService(IRepository<Belt> _beltRepository,ITrainingRepository _trainingRepository,IMapper mapper) : ICommonService
    {
        public  async Task<List<BeltDto>> GetBelts()
        {
           return await _beltRepository.Query().ProjectTo<BeltDto>(mapper.ConfigurationProvider).ToListAsync();

                
              
        }

        public async Task<int> GetNumberOfTrainingsForClub(int year,int? month)
        {
            if (month.HasValue)
            {
                return await _trainingRepository.Query().CountAsync(t => t.Date.Year == year && t.Date.Month == month.Value);
            }
            else
            {
                return await _trainingRepository.Query().CountAsync(t=>t.Date.Year==year);

            }

        }
    }
}
