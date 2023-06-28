using AutoMapper;
using BusinessObject;
using BusinessObject.Enum;
using DataAccess;
using DataTransfer.Request;

namespace Repositories.Impl
{
    public class ContractRepository : IContractRepository
    {
        public string createContract(ContractReq req)
        {
            var checkEmployee = EmployeeDAO.FindEmployeeById(req.EmployeeId);
            var checkPosition = PositionDAO.FindPositionById(req.PositionId);
            var checkLeve = LevelDAO.FindLevelById(req.LevelId);
            if (checkEmployee == null)
            {
                return "User Not Found";
            }
            if (checkPosition == null)
            {
                return "Position not found";
            }
            if (checkLeve == null)
            {
                return "Level not found";
            }
            if (req.StartDate.Date < DateTime.Now.Date)
            {
                return "date time create can not less than today";
            }
            if (req.EndDate.Date < DateTime.Now.Date)
            {
                return "date time end can not less than createDate";
            }
            if (req.BaseSalary <= 0)
            {
                return "base salary must larger than 0";
            }
            if (req.DateOffPerYear < 0)
            {
                return " day off per year can not less than 0";
            }
            if (req.SalaryType == EnumList.SalaryType.Gross)
            {
                if (req.TaxRate <= 0 || req.InsuranceRate <= 0)
                {
                    return "Gross & Insurance larger than 0";
                }
            }
            var config = new MapperConfiguration(cfg => cfg.CreateMap<ContractReq, Contract>().ReverseMap());
            var mapper = new Mapper(config);
            Contract contract = mapper.Map<Contract>(req);
            contract.Status = EnumList.ContractStatus.Waiting;
            ContractDAO.CreateContract(contract);
            return "ok";
        }

        public List<Contract> GetContracts()
        {
            return ContractDAO.GetAll();
        }

        public int updateStatusContract(int contractId, int status)
        {
            var contract = ContractDAO.FindContractById(contractId);
            if (contract == null)
            {
                return -1;
            }
            contract.Status = (EnumList.ContractStatus)status;
            ContractDAO.UpdateContract(contract);
            return 1;
        }
    }
}
