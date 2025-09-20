using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TCM_App.Services.Interfaces;

namespace TCM_App.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommonController(ILogger<CommonController> logger,ICommonService _commonService) : BaseController
    {

        [HttpGet("belts")]
        public async Task<IActionResult> GetBelts()
        {
            try
            {
                var belts = await _commonService.GetBelts();
                return Ok(belts);
            }
            catch (Exception e)
            {
                logger.LogError(e, "Error getting belts");
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
            }
        }

        [HttpGet("members")]
        public async Task<IActionResult> GetMembersForClub()
        {
            try
            {
                var members = await _commonService.GetMembersForClub();
                return Ok(members);
            }
            catch (Exception e)
            {
                logger.LogError(e, "Error getting members");
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
            }
        }

        [HttpGet("number-of-trainings")]
        public async Task<IActionResult> GetNumberOfTrainingsForClub([FromQuery] int year, [FromQuery] int? month)
        {
            try
            {
                 var trainingsNumber = await _commonService.GetNumberOfTrainingsForClub(year,month);
                return Ok(trainingsNumber);
            }
            catch (Exception e)
            {
                logger.LogError(e, "Error getting trainings");
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
            }
        }


        [HttpGet("number-of-trainings-for-member")]
        public async Task<IActionResult> GetNumberOfTrainingsForMember([FromQuery] int year,[FromQuery] DateTime dateStarted, [FromQuery] int? month)
        {
            try
            {
                var trainingsNumber = await _commonService.GetNumberOfTrainingsForMember(year, month,dateStarted);
                return Ok(trainingsNumber);
            }
            catch (Exception e)
            {
                logger.LogError(e, "Error getting trainings");
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
            }
        }



        [HttpGet("club-numbers-info")]
        public async Task<IActionResult> GetClubNumbersInfo([FromQuery] int year, [FromQuery] int? month)
        {
            try
            {
                var result = await _commonService.GetClubNumbersInfo(year, month);
                return Ok(result);
            }
            catch (Exception e)
            {
                logger.LogError(e, "Error getting club numbers info");
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
            }
        }

        [HttpGet("club-trainings-attendance")]
        public async Task<IActionResult> GetNumberOfAttendedMemberTrainingsForEveryMonth(int clubId, int year, int? month)
        {
            try { 
                clubId = 1; // Replace with actual clubId from authenticated user context
                var result = await _commonService.GetNumberOfAttendedTrainingsForEveryMonth(clubId, year, month);
                return Ok(result);
            }
            catch (Exception e)
            {
                logger.LogError(e, "Error getting club trainings attendance");
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal server error");
            }
        }

    }
}
