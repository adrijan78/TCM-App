using Microsoft.AspNetCore.Mvc;
using TCM_App.Models.DTOs;

namespace TCM_App.Services.Interfaces
{
    public interface ICommonService
    {
        Task<List<BeltDto>> GetBelts();
        Task<int> GetNumberOfTrainingsForClub(int year, int? month);

        Task<Dictionary<int, int>> GetNumberOfAttendedTrainingsForEveryMonth(int clubId, int year, int? month);

        Task<ClubNumbersInfoDto> GetClubNumbersInfo([FromQuery] int year, [FromQuery] int? month);

        Task<List<MemberSimpleDto>> GetMembersForClub();
    }
}
