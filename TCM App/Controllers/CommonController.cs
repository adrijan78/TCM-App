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

    }
}
