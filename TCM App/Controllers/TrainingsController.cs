using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TCM_App.Helpers;
using TCM_App.Services.Interfaces;

namespace TCM_App.Controllers
{

  
    public class TrainingsController(ITrainingService _trainingService, ILogger<TrainingsController> _logger) :BaseController
    {

        [HttpGet("trainings")]
        public async Task<IActionResult> GetTrainings([FromQuery]TrainingParams trainingParams)
        {
            try
            {
                return Ok(await _trainingService.GetTrainingsByClubId(1,trainingParams));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Cannot get  trainings for clubId");
                throw new Exception("Cannot get  trainings for clubId", ex);
            }
        }



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
