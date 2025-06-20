using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TCM_App.Data;
using TCM_App.Models.DTOs;
using TCM_App.Services.Interfaces;

namespace TCM_App.Controllers
{
    [Authorize]
    public class MembersController(
        IMemberService _memberService,
        ILogger<MembersController> logger,
        IMapper mapper) : BaseController
    {

        [HttpGet]
        public async Task<IActionResult> GetMembers()
        {
            try
            {
                // Zemi go id na club od najaveniot korisnik koga kje koristis Identity 
                var members = await _memberService.GetMembers(1);
                return Ok(mapper.Map<List<MemberListDto>>(members));
            }
            catch (Exception e)
            {
                logger.LogError(e, "Error getting members");
                throw new Exception(e.ToString());
            }
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetMember(int id)
        {
            try
            {
                var member = await _memberService.GetMember(id);
                if (member == null)
                {
                    return NotFound();
                }
                return Ok(mapper.Map<MemberDto>(member));
            }
            catch (Exception e)
            {
                logger.LogError(e, "Error getting member with id {Id}", id);
                throw new Exception(e.ToString());
            }

        }

        [HttpGet("memberTraningData/{id}")]
        public async Task<IActionResult> GetMemberAttendanceAndPerformance(int id)
        {
            try
            {
                    var attendance = await _memberService.GetMemberAttendanceAndPerformance(id);
                    return Ok(mapper.Map<List<MemberTrainingDto>>(attendance));
            }
            catch (Exception e)
            {
                logger.LogError(e, "Error getting attendance and performance for member with id {MemberId}", id);
                throw new Exception(e.ToString());
            }
        }
    }
}
