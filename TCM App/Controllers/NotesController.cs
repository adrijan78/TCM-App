using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TCM_App.Services.Interfaces;

namespace TCM_App.Controllers
{
    public class NotesController(INoteService _noteService,ILogger<NotesController> logger) : BaseController
    {
        [HttpGet("notes")]
        public async Task<IActionResult> GetNotes([FromQuery] DateTime dateCreated, [FromQuery] int fromMemberId, [FromQuery]int toMemberId, [FromQuery]bool createdForTraining)
        {
            try
            {
                var notes = await _noteService.GetNotesForMember(dateCreated, fromMemberId, toMemberId,createdForTraining);
                return Ok(notes);
            }
            catch (Exception ex)
            {
                // Log the exception (not shown here for brevity)
                logger.LogError(ex, "Error getting notes for member from {FromMemberId} to {ToMemberId} on {DateCreated}", fromMemberId, toMemberId, dateCreated);
                throw new Exception("An error occurred while retrieving notes. Please try again later.",ex);


            }
        } 


    }
}
