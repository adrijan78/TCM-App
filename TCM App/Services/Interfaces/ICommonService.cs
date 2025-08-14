using TCM_App.Models.DTOs;

namespace TCM_App.Services.Interfaces
{
    public interface ICommonService
    {
        Task<List<BeltDto>> GetBelts();
    }
}
