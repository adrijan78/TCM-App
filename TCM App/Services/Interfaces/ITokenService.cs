using TCM_App.Models;

namespace TCM_App.Services.Interfaces
{
    public interface ITokenService
    {
        Task<string> CreateToken(Member member);

    }
}
