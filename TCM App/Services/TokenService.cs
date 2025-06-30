
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TCM_App.Models;
using TCM_App.Services.Interfaces;

namespace TCM_App.Services
{
    public class TokenService(IConfiguration configuration, UserManager<Member> _userManager,RoleManager<AppRole> roleManager): ITokenService
    {
        public async Task<string> CreateToken(Member member)
        {
            var tokenKey = configuration["TokenKey"] ?? throw new Exception("Token key not found");
            if(tokenKey.Length<64)
            {
                throw new Exception("Token key is too short");
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey));

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, member.Id.ToString()),
                new Claim(ClaimTypes.Name, member.FirstName + " " + member.LastName),
                new Claim(ClaimTypes.Email, member.Email),
            };

            var memberr = await _userManager.FindByIdAsync(member.Id.ToString());

            

            var roles = await _userManager.GetRolesAsync(memberr!);


                foreach (var role in roles)
                {
                    claims.Add(new Claim(ClaimTypes.Role, role));
                }


            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(7),
                SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
    
}
