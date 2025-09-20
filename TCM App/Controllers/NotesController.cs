using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TCM_App.Helpers;
using TCM_App.Models.DTOs;
using TCM_App.Services.Interfaces;

namespace TCM_App.Controllers
{
    public class NotesController(INoteService _noteService,ILogger<NotesController> logger) : BaseController
    {
        [HttpGet("notes")]
        public async Task<IActionResult> GetNotes( [FromQuery] int fromMemberId, [FromQuery]int? toMemberId, [FromQuery] int? trainingId)
        {
            try
            {
                var memberCoachId = int.Parse(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)!.Value);

                var notes = await _noteService.GetNotesForMember( memberCoachId, toMemberId,trainingId);
                return Ok(notes);
            }
            catch (Exception ex)
            {
                // Log the exception (not shown here for brevity)
                logger.LogError(ex, "Error getting notes for member from {FromMemberId} to {ToMemberId}", fromMemberId, toMemberId);
                throw new Exception("An error occurred while retrieving notes. Please try again later.",ex);


            }
        }

        [HttpGet("club-notes")]
        public async Task<IActionResult> GetClubNotes([FromQuery] NoteParams noteParams)
        {
            try
            {
                var coachId = int.Parse(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value ?? "0");
                if (coachId == 0)
                {
                    return BadRequest("Invalid coach ID.");
                }
                noteParams.FromMemberId = coachId;
                var notes = await _noteService.GetClubNotes(noteParams);
                Response.AddPaginationHeader(notes);
                return Ok(notes);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error getting club notes for coach with id {CoachId}", User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value);
                throw new Exception("An error occurred while retrieving club notes. Please try again later.", ex);
            }

        }

        [HttpPost("addNote")]
        public  async Task<IActionResult> AddNote(AddNoteDto note)
        {
            try
            {
                var coachId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

                if (coachId != null)
                {

                    note.FromMemberId = int.Parse(coachId);

                    await _noteService.AddNote(note);
                }

                return Ok();
            }
            catch (Exception ex)
            {

                logger.LogError(ex, "Error adding notes for member with id {ToMemberId} on {DateCreated}", note.ToMemberId, note.CreatedAt);
                throw new Exception("An error occurred while adding notes. Please try again later.", ex);
            }
        }




        [HttpDelete("deleteNote/{noteId}")]
        public async Task<IActionResult> DeleteNote(int noteId)
        {
            try
            {
                await _noteService.DeleteNote(noteId);
                return Ok();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error occured while trying to delete the note with id {NoteId}",noteId);
                throw new Exception("An error occurred while deleting note. Please try again later.", ex);
            }
        }


    }
}
