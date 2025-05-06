using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TCM_App.Data;

namespace TCM_App.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MembersController(DataContext context, ILogger<MembersController> logger) : ControllerBase
    {

        [HttpGet]
        public async Task<IActionResult> GetMembers()
        {
            // This is where you would normally get the members from the database
            try
            {
                var members = await context.Members.ToListAsync();
                return Ok(members);
            }
            catch (Exception e)
            {
                logger.LogError(e, "Error getting members");
                throw new Exception(e.ToString());
            } 
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetMembers(int id)
        {
            try
            {
               var member = await context.Members.FirstOrDefaultAsync(m => m.Id == id);
                if (member == null)
                {
                    return NotFound();
                }
                return Ok(member);
            }
            catch (Exception e)
            {
                logger.LogError(e, "Error getting member with id {Id}", id);
                throw new Exception(e.ToString());
            }
            
        }
    }
}
