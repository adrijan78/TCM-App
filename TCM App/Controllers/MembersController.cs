using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TCM_App.Data;
using TCM_App.EmailService;
using TCM_App.EmailService.Services.Interfaces;
using TCM_App.Helpers;
using TCM_App.Models.DTOs;
using TCM_App.Services.Interfaces;

namespace TCM_App.Controllers
{
    //[Authorize]
    public class MembersController(
        IMemberService _memberService,
        ILogger<MembersController> logger,
        IEmailService _emailService,
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
                //var userClaimsRole = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;
                //var userClaimsId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

                //if(userClaimsRole == "Member")
                //{
                //    var claimId= int.Parse(userClaimsId!);
                //    if (userClaimsId != id.ToString())
                //    {
                //        claimId = int.Parse(userClaimsId!);
                //    }
                //}

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

                _emailService.SendEmailAsync(new SendEmailRequest
                {
                    Recipient = member.Email,
                    Subject = "Промена на податоци",
                    MessageBody = $"Почитуван/а {member.FirstName} {member.LastName},<br/>Вашите податоци се успешно променети.<br/>Со почит,<br/>Тимот на TCM"
                });


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
                var members = await _memberService.GetMembersGroupedByBelt();
                //return Ok(members);
                return Ok(members);
            }
            catch (Exception e)
            {
                logger.LogError(e, "Error getting members grouped by belt");
                throw new Exception(e.ToString());
            }
        }


        [HttpPut("updateMembersAttendance")]
        public async Task<IActionResult> UpdateMembersAttendance([FromBody] List<UpdateMemberTrainingDto> memberAttendances)
        {
            try
            {
                bool isCoach = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value == "Coach";

                await _memberService.UpdateMemberAttendanceAndPerformace(memberAttendances, isCoach);
                return Ok(new ApiResponse<string>
                {
                    Success = true,
                    Message = "Успешно ажурирање на присуство",
                });
            }
            catch (Exception e)
            {
                logger.LogError(e, "Проблем при ажурирање на присуство");
                throw new Exception(e.ToString());
            }
        }

        [HttpGet("member-belts/{id}")]
        public async Task<IActionResult> GetMemberBelts(int id)
        {
            try
            {
                var memberBelts = await _memberService.GetMemberBelts(id);
                return Ok(memberBelts);
            }
            catch (Exception e)
            {
                logger.LogError(e, "Error getting belts for member with id {Id}", id);
                throw new Exception(e.ToString());
            }
        }

        [HttpGet("member-payments/{id}")]
        public async Task<IActionResult> GetMemberPayments(int id, [FromQuery] BaseParams paymentParams)
        {
            try
            {
                var payments = await _memberService.GetMemberPayments(id,paymentParams); // Replace 1 with the actual clubId from the authenticated user context
                Response.AddPaginationHeader(payments);
                return Ok(payments);
            }
            catch (Exception e)
            {
                logger.LogError(e, "Error getting member payments");
                throw new Exception(e.ToString());
            }
        }

        [HttpGet("members-payments")]
        public async Task<IActionResult> GetMembersPayments([FromQuery] PaymentParams paymentParams)
        {
            try
            {
                var payments = await _memberService.GetMembersPayments( paymentParams);
                Response.AddPaginationHeader(payments);
                return Ok(payments);
            }
            catch (Exception e)
            {
                logger.LogError(e, "Error getting members payments");
                throw new Exception(e.ToString());
            }
        }


        [HttpPost("add-belt-exam")]
        public async Task<IActionResult> AddBeltExamForMember([FromBody]UpdateMemberBeltDto memberBelt)
        {
            try
            {
                var newMemberBeltId = await _memberService.AddBeltExamForMember(memberBelt);

                
                return Ok(new ApiResponse<int>
                {
                    Success = true,
                    Message = "Успешно додаден појас",
                    Data = newMemberBeltId
                });
            }
            catch (Exception e)
            {
                logger.LogError(e, "Error adding belt exam for member with id {MemberId}", memberBelt.MemberId);
                throw new Exception(e.ToString());
            }


        }

        [HttpDelete("delete-belt-exam/{id}")]
        public async Task<IActionResult> DeleteBeltExamForMember(int id)
        {
            try
            {
               
                // Proceed to delete the member belt
                await _memberService.DeleteBeltExamForMember(id);

                

                return Ok(new ApiResponse<string>
                {
                    Success = true,
                    Message = "Успешно го избришавте полагањето на членот"
                });
            }
            catch (Exception e)
            {
                logger.LogError(e, "Error deleting belt exam with id {Id}", id);
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

        [HttpDelete("delete-payment/{id}")]
        public async Task<IActionResult> DeletePayment(int id)
        {
            try
            {
                var deletedPaymentId = await _memberService.DeleteMemberPayment(id);
                return Ok(new ApiResponse<int>
                {
                    Success = true,
                    Message = "Успешно избришавте уплата",
                    Data = deletedPaymentId
                });
            }
            catch (Exception e)
            {
                logger.LogError(e, "Error deleting payment with id {Id}", id);
                throw new Exception(e.ToString());
            }


        }
    }
}
