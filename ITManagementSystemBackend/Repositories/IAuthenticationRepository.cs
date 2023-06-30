using BusinessObject;
using DataTransfer.Request;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories
{
    public interface IAuthenticationRepository
    {

        public string Login(LoginDTO login);
    }
}
