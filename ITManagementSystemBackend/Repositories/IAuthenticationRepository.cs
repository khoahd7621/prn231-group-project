using DataTransfer.Request;

namespace Repositories
{
    public interface IAuthenticationRepository
    {

        public string Login(LoginDTO login);
    }
}
