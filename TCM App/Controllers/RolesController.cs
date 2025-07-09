using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TCM_App.Models;
using TCM_App.Models.DTOs;

namespace TCM_App.Controllers
{
    [Authorize (Roles ="Coach")]
    public class RolesController(RoleManager<AppRole> _roleManager,ILogger<RolesController> logger,IMapper mapper) : BaseController
    {
        

        [HttpGet]
        public async Task<IActionResult> GetRoles()
        {
            try
            {
                var roles = await _roleManager.Roles.ToListAsync();
                if (roles == null || !roles.Any())
                {
                    return NotFound("No roles found");
                }

                var result=mapper.Map<RoleDto[]>(roles);


                return Ok(result);
            }
            catch (Exception e)
            {
                logger.LogError(e, "Error retrieving roles");
                return StatusCode(StatusCodes.Status500InternalServerError, "Error retrieving roles");
            }
        }

    }
}
