using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using TCM_App.Models;
using TCM_App.Models.DTOs;
using TCM_App.Repositories.Interfaces;
using TCM_App.Services.Interfaces;

namespace TCM_App.Services
{
    public class CommonService(IRepository<Belt> _beltRepository,IMapper mapper) : ICommonService
    {
        public  async Task<List<BeltDto>> GetBelts()
        {
           return await _beltRepository.Query().ProjectTo<BeltDto>(mapper.ConfigurationProvider).ToListAsync();

                
              
        }
    }
}
