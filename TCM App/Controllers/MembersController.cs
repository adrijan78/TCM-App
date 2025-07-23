using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TCM_App.Data;
using TCM_App.Helpers;
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
        [Authorize (Policy = "RequireCoachRole")]
        public async Task<IActionResult> GetMembers([FromQuery]UserParams userParams)
        {
            try
            {
                // Zemi go id na club od najaveniot korisnik koga kje koristis Identity 
                var members = await _memberService.GetMembers(1,userParams);
                Response.AddPaginationHeader(members);
                return Ok(members);
            }
            catch (Exception e)
            {
                logger.LogError(e, "Error getting members");
                throw new Exception(e.ToString());
            }
        }


        [HttpGet("{id}")]
        [Authorize(Policy = "RequireMemberAndCoachRole")]
        public async Task<IActionResult> GetMember(int id)
        {
            try
            {
                var userClaimsRole = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;
                var userClaimsId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

                if(userClaimsRole == "Member")
                {
                    var claimId= int.Parse(userClaimsId!);
                    if (userClaimsId != id.ToString())
                    {
                        claimId = int.Parse(userClaimsId!);
                    }
                }

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
        [HttpPut("edit-member/{id}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> EditMember(int id, [FromForm] MemberEditDto member)
        {
            try
            {


                await _memberService.UpdateMember(id, member);

                return Ok(new ApiResponse<string>
                {
                    Success = true,
                    Message = "Успешна промена на податоци",
                });
            }
            catch (Exception e)
            {
                logger.LogError(e, "Error editing member with id {Id}", id);
                throw new Exception(e.ToString());
            }

        }

        [HttpGet("memberTraningData/{id}")]
        public async Task<IActionResult> GetMemberAttendanceAndPerformance(int id,[FromQuery] UserParams userParams)
        {
            try
            {
                    var attendance = await _memberService.GetMemberAttendanceAndPerformance(id, userParams);
                    return Ok(mapper.Map<List<MemberTrainingDto>>(attendance));
            }
            catch (Exception e)
            {
                logger.LogError(e, "Error getting attendance and performance for member with id {MemberId}", id);
                throw new Exception(e.ToString());
            }
        }


        [HttpGet("membersGroupedByBelt")]
        public async Task<IActionResult> GetMembersGroupedByBelt()
        {
            try
            {
                //var members = await _memberService.GetMembersGroupedByBelt(userParams);
                //return Ok(members);
                return Ok(null);
            }
            catch (Exception e)
            {
                logger.LogError(e, "Error getting members grouped by belt");
                throw new Exception(e.ToString());
            }
        }




        [HttpDelete("deactivate-member/{id}")]
        public async Task<IActionResult> DeactivateMember(int id)
        {
            try
            {
                await _memberService.DeactivateMember(id);
                return Ok();
            }
            catch (Exception e)
            {
                logger.LogError(e, "Error deleting member with id {Id}", id);
                throw new Exception(e.ToString());
            }
        }
    }
}
