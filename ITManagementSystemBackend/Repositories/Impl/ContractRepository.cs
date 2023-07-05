using AutoMapper;
using BusinessObject;
using BusinessObject.Enum;
using DataAccess;
using DataTransfer.Request;

namespace Repositories.Impl
{
    public class ContractRepository : IContractRepository
    {
        public bool ActiveContract(int contractId)
        {
            var check = false;
            var contract = ContractDAO.FindContractById(contractId);
            var checkEmployee = ContractDAO.checkEmployeeHasAnyActiveContract(contract.EmployeeId);
            if (checkEmployee != null)
                return false;
            var listContractOfThisEmp = ContractDAO.GetContractsByEmpId(contract.EmployeeId);
            foreach (var cont in listContractOfThisEmp)
            {
                if (cont.EndDate.Date == contract.StartDate.Date) check = true;
            }
            if (check) contract.StartDate = contract.StartDate.AddDays(1);
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
                return "day off per year can not less than 0";
            if (req.SalaryType == EnumList.SalaryType.Gross)
            {
                if (req.TaxRate <= 0 || req.InsuranceRate <= 0)
                    return "gross & insurance larger than 0";
            }
            if (req.EmployeeType == EnumList.EmployeeType.PartTime)
            {
                req.OTSalaryRate = 1;
            }
            else
            {
                if (req.OTSalaryRate <= 0 || req.OTSalaryRate > 100)
                {
                    return "OT rate of fulltime must grather than 0";
                }
            }
            var config = new MapperConfiguration(cfg => cfg.CreateMap<ContractReq, Contract>().ReverseMap());
            var mapper = new Mapper(config);
            Contract contract = mapper.Map<Contract>(req);
            contract.Status = EnumList.ContractStatus.Waiting;
            ContractDAO.CreateContract(contract);
            return "ok";
        }

        public bool DeactivateContract(int contractId)
        {
            var contract = ContractDAO.FindContractById(contractId);
            contract.Status = EnumList.ContractStatus.Expired;
            contract.EndDate = DateTime.Now;
            ContractDAO.UpdateContract(contract);
            return true;
        }

        public bool DeleteContract(Contract contract)
        {
            if (contract.Status != EnumList.ContractStatus.Waiting)
                return false;
            ContractDAO.DeleteContract(contract);
            return true;
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
            if (contract.Status != EnumList.ContractStatus.Waiting)
                return false;
            var config = new MapperConfiguration(cfg => cfg.CreateMap<ContractReq, Contract>().ReverseMap());
            var mapper = new Mapper(config);
            mapper.Map(req, contract);
            ContractDAO.UpdateContract(contract);
            return true;
        }
    }
}
