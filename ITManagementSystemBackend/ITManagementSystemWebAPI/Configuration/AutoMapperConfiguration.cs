using AutoMapper;
using BusinessObject;
using DataTransfer.Request;

namespace ITManagementSystemWebAPI.Configuration
{
    public class AutoMapperConfiguration : Profile
    {
        public AutoMapperConfiguration()
        {
            CreateMap<TakeLeaveReq, TakeLeave>();
        }
    }
}
