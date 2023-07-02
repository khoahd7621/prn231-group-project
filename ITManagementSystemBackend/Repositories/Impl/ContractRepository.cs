using AutoMapper;
using BusinessObject;
using BusinessObject.DTO;
using BusinessObject.Enum;
using DataAccess;
using DataTransfer.Request;

namespace Repositories.Impl
{
    public class ContractRepository : IContractRepository
    {
        public bool ActiveContract(int contractId)
        {
            var contract = ContractDAO.FindContractById(contractId);
            var checkEmployee = ContractDAO.checkEmployeeHasAnyActiveContract(contract.EmployeeId);
            if (checkEmployee != null)
            {
                return false;
            }
            contract.Status = EnumList.ContractStatus.Active;
            ContractDAO.UpdateContract(contract);
            return true;
        }

        public string CreateContract(ContractReq req)
        {
            var checkEmployee = EmployeeDAO.FindEmployeeById(req.EmployeeId);
            var checkPosition = PositionDAO.FindPositionById(req.PositionId);
            var checkLeve = LevelDAO.FindLevelById(req.LevelId);
            if (checkEmployee == null)
                return "User Not Found";
            if (checkPosition == null)
                return "Position not found";
            if (checkLeve == null)
                return "Level not found";
            if (req.StartDate.Date < DateTime.Now.Date)
                return "date time create can not less than today";
            if (req.EndDate.Date < DateTime.Now.Date)
                return "date time end can not less than createDate";
            if (req.BaseSalary <= 0)
                return "base salary must larger than 0";
            if (req.DateOffPerYear < 0)
                return " day off per year can not less than 0";
            if (req.SalaryType == EnumList.SalaryType.Gross)
            {
                if (req.TaxRate <= 0 || req.InsuranceRate <= 0)
                    return "Gross & Insurance larger than 0";
            }
            var config = new MapperConfiguration(cfg => cfg.CreateMap<ContractReq, Contract>().ReverseMap());
            var mapper = new Mapper(config);
            Contract contract = mapper.Map<Contract>(req);
            contract.Status = EnumList.ContractStatus.Waiting;
            ContractDAO.CreateContract(contract);
            return "ok";
        }

        public Contract GetContract(int contractId)
        {
            return ContractDAO.FindContractById(contractId);
        }

        public List<Contract> GetContracts()
        {
            return ContractDAO.GetAll();
        }

        public bool UpdateContract(int contractId, ContractReq req)
        {
           var contract = ContractDAO.FindContractById(contractId);
           if(contract.Status == EnumList.ContractStatus.Active)
               return false;
           var config = new MapperConfiguration(cfg => cfg.CreateMap<ContractReq, Contract>().ReverseMap());
           var mapper = new Mapper(config);
           mapper.Map(req, contract);
           ContractDAO.UpdateContract(contract);
           return true;
        }

        public int UpdateStatusContract(int contractId, int status)
        {
            var contract = ContractDAO.FindContractById(contractId);
            if (contract == null)
                return -1;
            if(contract.Status == EnumList.ContractStatus.Active)
            {
                if(status == (int) EnumList.ContractStatus.Waiting)
                    return 0;
            }
            contract.Status = (EnumList.ContractStatus)status;
            ContractDAO.UpdateContract(contract);
            return 1;
        }
    }
}
