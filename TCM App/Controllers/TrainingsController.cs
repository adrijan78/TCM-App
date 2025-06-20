using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TCM_App.Services.Interfaces;

namespace TCM_App.Controllers
{

    [Authorize]
    public class TrainingsController(ITrainingService _trainingService, ILogger<TrainingsController> _logger) :BaseController
    {
        [HttpGet("numberOfTrainingsPerMonth/{clubId}")]
        public async Task<IActionResult> GetNumberOfTrainingsForEveryMonth(int clubId)
        {
            try
            {
                return Ok(await _trainingService.GetNumberOfTrainingsForEveryMonth(clubId));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex,"Cannot get number of trainings for every month");
                throw new Exception("Cannot get number of trainings for every month",ex);
            }
           
        }


    }
}
