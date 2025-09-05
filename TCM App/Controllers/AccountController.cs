using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Security.Cryptography;
using TCM_App.Data;
using TCM_App.Models;
using TCM_App.Models.DTOs;
using TCM_App.Repositories.Interfaces;
using TCM_App.Services.Interfaces;

namespace TCM_App.Controllers
{
    [ApiController]
    public class AccountController(IMapper  _mapper,UserManager<Member> userManager,
        ITokenService tokenService,
        RoleManager<AppRole> roleManager,
        IRepository<MemberBelt> _memberBeltRepository,
        IRepository<Photo> _photoRepository
        ) : BaseController
    {
        [HttpPost("register")]
        public async Task<IActionResult> Register(MemberRegisterDto registerDto)
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
            else
            {
                if (registerDto.RolesIds != null && registerDto.RolesIds.Length > 0)
                {
                    foreach (int roleId in registerDto.RolesIds)
                    {
                        var role = await roleManager.FindByIdAsync(roleId.ToString());
                        if (role != null)
                        {
                            var roleResult = await userManager.AddToRoleAsync(member, role.Name!);
                            if (!roleResult.Succeeded)
                            {
                                return BadRequest(new ApiResponse<string>
                                {
                                    Success = false,
                                    Message = "Failed to assign role to member"
                                });
                            }
                        }
                        else
                        {
                            return NotFound(new ApiResponse<string>
                            {
                                Success = false,
                                Message = $"Role with ID {roleId} not found"
                            });
                        }

                    }

                  
                }


                var memberBelt = new MemberBelt
                {
                    MemberId = member.Id,
                    BeltId = (int)registerDto.Belt.Id, // Assuming Belt is an enum or has an Id property
                    DateReceived = registerDto.Belt.EarnedOn,
                    Description="",
                    IsCurrentBelt = true

                };

                await _memberBeltRepository.AddAsync(memberBelt);

                await _memberBeltRepository.SaveChangesAsync();




                return Ok(new ApiResponse<MemberTokenDto>
                {
                    Message = "Успешно регистриран член",
                    Success = true,
                    Data = new MemberTokenDto
                    {
                        FirstName = member.FirstName,
                        LastName = member.LastName,
                        Email = member.Email!,
                        Token = await tokenService.CreateToken(member),
                        Roles = (List<string>)await userManager.GetRolesAsync(member),

                    }
                }
                );
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login (LoginMemberDto loginMemberDto)
        {
            try
            {
                IList<string> roles = new List<string>();

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
                else
                {
                    roles = await userManager.GetRolesAsync(member);
                    if (roles == null || roles.Count == 0)
                    {
                        return Unauthorized(new ApiResponse<string>
                        {
                            Success = false,
                            Message = "Member has no assigned roles"
                        });
                    }
                }
                var pic = await _photoRepository.Query()
            .Where(p => p.MemberId == member.Id)
            .Select(p => p.Url)
            .FirstOrDefaultAsync();


                return Ok(new ApiResponse<MemberTokenDto>
                    {
                        Message = "Успешно регистриран член",
                        Success = true,
                        Data = new MemberTokenDto
                        {
                            
                            FirstName = member.FirstName,
                            LastName = member.LastName,
                            Email = member.Email!,
                            Token = await tokenService.CreateToken(member),
                            Roles= (List<string>)roles,
                            ProfilePicture = pic
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
