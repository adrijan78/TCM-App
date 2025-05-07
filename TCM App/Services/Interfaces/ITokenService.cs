using TCM_App.Models;

namespace TCM_App.Services.Interfaces
{
    public interface ITokenService
    {
        string CreateToken(Member member);

    }
}
