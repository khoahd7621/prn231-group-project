using DataTransfer.Request;
using DataTransfer.Response;

namespace Repositories
{
    public interface IAuthenticationRepository
    {
        public string Login(LoginDTO login);
        public ProfileEmployeeResponse GetProfile(string token);
        public bool ChangePassword(int empId, ChangePasswordReq req);
        public bool FirstChangePassword(int empId, FirstChangePasswordReq req);
    }
}
