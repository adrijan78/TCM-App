using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using TCM_App.Data;
using TCM_App.Models;
using TCM_App.Models.DTOs;
using TCM_App.Services.Interfaces;

namespace TCM_App.Controllers
{
    [ApiController]
    public class AccountController(IMapper  _mapper,UserManager<Member> userManager,ITokenService tokenService) : BaseController
    {
        [HttpPost("register")]
        public async Task<IActionResult> Register(MemberRegisterDto  registerDto)
        {
            if (await MemberExists(registerDto.Email))
            {
                return BadRequest("User already exists");
            }


            var member = _mapper.Map<Member>(registerDto);
            
            var result = await userManager.CreateAsync(member, registerDto.Password);

            if (!result.Succeeded)
            {
                return BadRequest(new ApiResponse<string>
                {
                    Success = false,
                    Message = "Failed to register member"
                });
            }



            return Ok(new ApiResponse<MemberTokenDto>{
                Message= "Успешно регистриран член",
                Success = true,
                Data = new MemberTokenDto
                {
                    FirstName = member.FirstName,
                    LastName = member.LastName,
                    Email = member.Email,
                    Token = await tokenService.CreateToken(member)
                }
            }
            );
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login (LoginMemberDto loginMemberDto)
        {
            try
            {
                var member = await userManager.Users
                    .FirstOrDefaultAsync(m => m.Email == loginMemberDto.Email.ToLower());
                if (member == null)
                {
                    return Unauthorized(new ApiResponse<string>
                    {
                        Success = false,
                        Message = "Invalid credentials"
                    });
                }

                var result = await userManager.CheckPasswordAsync(member, loginMemberDto.Password);
                if (!result)
                {
                    return Unauthorized(new ApiResponse<string>
                    {
                        Success = false,
                        Message = "Invalid credentials"
                    });
                }


                return Ok(new ApiResponse<MemberTokenDto>
                {
                    Message = "Успешно регистриран член",
                    Success = true,
                    Data = new MemberTokenDto
                    {
                        FirstName = member.FirstName,
                        LastName = member.LastName,
                        Email = member.Email,
                        Token = await tokenService.CreateToken(member)
                    }
                }
            );
            }
            catch (Exception e)
            {

                throw new Exception(e.ToString());
            }
            



        }


        //[HttpPost("register-member")]
        //public async Task<IActionResult> RegisterMember( MemberRegisterDto registerDto)
        //{
        //    try
        //    {
        //        if (await MemberExists(registerDto.Email))
        //        {
        //            return BadRequest(new ApiResponse
        //            {
        //                Success=false,
        //                Message = "Member already exists"
        //            });
        //        }
        //        using var hmac = new HMACSHA512();
        //        var member = new Member
        //        {
        //            FirstName = registerDto.FirstName,
        //            LastName = registerDto.LastName,
        //            Email = registerDto.Email,
        //            //PasswordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(registerDto.Password)),
        //            //PasswordSalt = hmac.Key,
        //            IsActive = true,
        //            StartedOn = DateTime.UtcNow,
        //            IsCoach = false,
        //            DateOfBirth = registerDto.DateOfBirth,
        //            //Zemi go klubot od najaveniot korisnik
        //            ClubId = 1,
        //            Height = registerDto.Height,
        //            Weight = registerDto.Weight,

        //        };
        //        context.Members.Add(member);
        //        await context.SaveChangesAsync();

        //        return Ok(new ApiResponse
        //        {
        //            Success = true,
        //            Message = "Member registered successfully",
                    
        //        });

        //    }
        //    catch (Exception e)
        //    {
                
        //        throw new Exception(e.ToString());
        //    }
        //}
            

        private async Task<bool> MemberExists(string email)
        {
            return await userManager.FindByEmailAsync(email) != null;
        }
    }
}
