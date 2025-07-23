using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TCM_App.Helpers;
using TCM_App.Models.DTOs;
using TCM_App.Models.Enums;
using TCM_App.Services.Interfaces;

namespace TCM_App.Controllers
{

  
    public class TrainingsController(ITrainingService _trainingService, ILogger<TrainingsController> _logger) : BaseController
    {

        [HttpGet("")]
        public async Task<IActionResult> GetTrainings([FromQuery] TrainingParams trainingParams)
        {
            try
            {
                var trainings = await _trainingService.GetTrainingsByClubId(1, trainingParams); // Replace 1 with the actual clubId from the authenticated user context
                Response.AddPaginationHeader(trainings);
                return Ok(trainings);
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
                _logger.LogError(ex, "Cannot get number of trainings for every month");
                throw new Exception("Cannot get number of trainings for every month", ex);
            }

        }

        [HttpGet("training-details/{id}")]
        public async Task<IActionResult> GetTraining(int id, [FromQuery] int clubId)
        {
            try
            {
                var training = await _trainingService.GetTraining(id, clubId);
                if (training == null)
                {
                    return NotFound();
                }
                return Ok(training);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Cannot get training with id {Id}", id);
                throw new Exception($"Cannot get training with id {id}", ex);
            }
        }


        [HttpGet("training-types")]
        public IActionResult GetTrainingTypes()
        {
            try
            {
                var trainingTypes = Enum.GetValues(typeof(TrainingType))
                    .Cast<TrainingType>()
                    .Select(e => new { Id = (int)e, Name = e.ToString() })
                    .ToList();
                return Ok(trainingTypes);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Cannot get training types");
                throw new Exception("Cannot get training types", ex);
            }
        }


        [HttpPost("create-training")]
        public async Task<IActionResult> CreateTraining([FromBody] CreateTrainingDto trainingDto)
        {
            try
            {
                if (trainingDto == null)
                {
                    return BadRequest("Training data is null");
                }
                var result = await _trainingService.AddTraining(trainingDto);
                return CreatedAtAction(nameof(GetTraining), new { id = result }, result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Cannot create training");
                throw new Exception("Cannot create training", ex);
            }
        }






    }
}
