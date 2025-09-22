using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Security.Cryptography;
using TCM_App.Data;
using TCM_App.EmailService;
using TCM_App.EmailService.Services.Interfaces;
using TCM_App.Models;
using TCM_App.Models.DTOs;
using TCM_App.Repositories.Interfaces;
using TCM_App.Services.Interfaces;
using TCM_App.Services.StripeServices;

namespace TCM_App.Controllers
{
    [ApiController]
    public class AccountController(IMapper  _mapper,UserManager<Member> userManager,
        ITokenService tokenService,
        RoleManager<AppRole> roleManager,
        IRepository<MemberBelt> _memberBeltRepository,
        IRepository<Photo> _photoRepository,
        IEmailService _emailService,
        IStripeService _stripeService,
        IRepository<Payments> _paymentsRepository
        ) : BaseController
    {
        [HttpPost("register")]
        public async Task<IActionResult> Register(MemberRegisterDto registerDto)
        {
            if (await MemberExists(registerDto.Email))
            {
                return Problem(
                        title: "Членот веќе постои",
                        statusCode: StatusCodes.Status400BadRequest
                    );
            }


            var member = _mapper.Map<Member>(registerDto);

            

            var result = await userManager.CreateAsync(member, registerDto.Password);

            if (!result.Succeeded)
            {
                return Problem(
                        title: "Настана грешка. Членот не беше додаден",
                        statusCode: StatusCodes.Status400BadRequest
                    );
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
                                return Problem(
                        title: "Неуспешно додавање на улога",
                        statusCode: StatusCodes.Status400BadRequest
                    );
                            }
                        }
                        else
                        {
                            return Problem(
                        title: "Улогата не е пронајдена",
                        statusCode: StatusCodes.Status404NotFound
                    );
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

                var customer=await _stripeService.CreateCustomer(new Models.Stripe.StripeCustomer
                {
                    Email = member.Email,
                    Name = $"{member.FirstName} {member.LastName}"
                });


                member.StripeCustomerId = customer.Id.ToString();
                await userManager.UpdateAsync(member);

                var today = DateTime.UtcNow;
                var payment = new Payments
                {
                    MemberId = member.Id,
                    IsPaidOnline = false,
                    PaymentDate = today,
                    NextPaymentDate = new DateTime(today.Year, today.Month, 15).AddMonths(1)
                };



                await _paymentsRepository.AddAsync(payment);
                await _paymentsRepository.SaveChangesAsync();






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
                    return Problem(
                       title: "Внесовте погрешни податоци",
                       statusCode: StatusCodes.Status401Unauthorized
                   );
                }

                if (!member.IsActive)
                {
                    return Problem(
                        title: "Вашиот акаунт е привремено деактивиран. Контактирајте го тренерот за повеќе информации",
                        statusCode: StatusCodes.Status401Unauthorized
                    );
                }

                var result = await userManager.CheckPasswordAsync(member, loginMemberDto.Password);
                if (!result)
                {
                    return Problem(
                            title:"Внесовте погрешни податоци",
                            statusCode:StatusCodes.Status401Unauthorized
                        );
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
                            Id=member.Id,
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



        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody]ForgotPasswordDto forgotPasswordDto)
        {
            var member = await userManager.FindByEmailAsync(forgotPasswordDto.Email);
            if (member == null)
            {
                return NotFound();
            }
            var token = await userManager.GeneratePasswordResetTokenAsync(member);
            var encodedToken = System.Web.HttpUtility.UrlEncode(token);
            var resetLink = $"{forgotPasswordDto.ClientUri}?email={forgotPasswordDto.Email}&token={encodedToken}";
            var emailRequest = new SendEmailRequest
            {
                Recipient = forgotPasswordDto.Email!,
                Subject = "Промена на лозинка",
                MessageBody = $"Можете да ја промените лозинката со кликање <a href='{resetLink}'>овде</a>."
            };
            _emailService.SendEmailAsync(emailRequest);
            return Ok(new ApiResponse<string>
            {
                Success = true,
                Message = "Линк за ресетирање на лозинката е испратен на вашата емаил адреса"
            });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto resetPasswordDto)
        {
            var member = await userManager.FindByEmailAsync(resetPasswordDto.Email);
            if (member == null)
            {
                return NotFound();
            }
            var decodedToken = resetPasswordDto.Token;
            var result = await userManager.ResetPasswordAsync(member, decodedToken!, resetPasswordDto.Password!);
            if (!result.Succeeded)
            {
                return BadRequest(new ApiResponse<IEnumerable<string>>
                {
                    Success = false,
                    Message = "Грешка при ресетирање на лозинката",
                    Data = result.Errors.Select(e => e.Description)
                });
            }
            return Ok(new ApiResponse<string>
            {
                Success = true,
                Message = "Лозинката е успешно променета"
            });
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
