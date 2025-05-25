using Microsoft.AspNetCore.Http;
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
    public class AccountController(DataContext context,ITokenService tokenService) : BaseController
    {
        [HttpPost("register")]
        public async Task<IActionResult> Register(MemberRegisterDto  registerDto)
        {
            if (await MemberExists(registerDto.Email))
            {
                return BadRequest("Member already exists");
            }

            using var hmac = new HMACSHA512();
            var member = new Member
            {
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                Email = registerDto.Email,
                PasswordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(registerDto.Password)),
                PasswordSalt = hmac.Key,
                IsActive = true,
                StartedOn = DateTime.UtcNow,
                IsCoach = false,
                DateOfBirth = registerDto.DateOfBirth
            };

            context.Members.Add(member);

            await context.SaveChangesAsync();

            return Ok(new MemberTokenDto
            { 
                FirstName = member.FirstName,
                LastName = member.LastName,
                Email = member.Email,
                Token = tokenService.CreateToken(member)
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login (LoginMemberDto loginMemberDto)
        {
            try
            {
                var member = await context.Members.FirstOrDefaultAsync(x => x.Email == loginMemberDto.Email);
                if (member == null)
                {
                    return Unauthorized("Invalid email");
                }

                using var hmac = new HMACSHA512(member.PasswordSalt);

                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(loginMemberDto.Password));
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != member.PasswordHash[i])
                    {
                        return Unauthorized("Invalid password");
                    }
                }

                return Ok(new MemberTokenDto
                {
                    FirstName = member.FirstName,
                    LastName = member.LastName,
                    Email = member.Email,
                    Token = tokenService.CreateToken(member)
                });
            }
            catch (Exception e)
            {

                throw new Exception(e.ToString());
            }
            



        }


        [HttpPost("register-member")]
        public async Task<IActionResult> RegisterMember( MemberRegisterDto registerDto)
        {
            try
            {
                if (await MemberExists(registerDto.Email))
                {
                    return BadRequest(new ApiResponse
                    {
                        Success=false,
                        Message = "Member already exists"
                    });
                }
                using var hmac = new HMACSHA512();
                var member = new Member
                {
                    FirstName = registerDto.FirstName,
                    LastName = registerDto.LastName,
                    Email = registerDto.Email,
                    PasswordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(registerDto.Password)),
                    PasswordSalt = hmac.Key,
                    IsActive = true,
                    StartedOn = DateTime.UtcNow,
                    IsCoach = false,
                    DateOfBirth = registerDto.DateOfBirth

                };
                context.Members.Add(member);
                await context.SaveChangesAsync();

                return Ok(new ApiResponse
                {
                    Success = true,
                    Message = "Member registered successfully",
                    
                });

            }
            catch (Exception e)
            {
                
                throw new Exception(e.ToString());
            }
        }
            

        private async Task<bool> MemberExists(string email)
        {
            return await context.Members.AnyAsync(x => x.Email == email.ToLower());
        }
    }
}
