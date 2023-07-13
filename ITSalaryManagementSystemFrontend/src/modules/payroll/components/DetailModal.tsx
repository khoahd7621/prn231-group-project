import { Modal, Typography } from "antd";
import dayjs from "dayjs";

import { PayrollStatusTag } from ".";
import { formatMoney } from "../../../utils/formatter";
import { PayrollModel } from "../models/PayrollModel";
import { EmployeeType } from "../../../constants/enum";

const { Title } = Typography;

type Props = {
  data: (PayrollModel & { key: number }) | null;
  setData: React.Dispatch<React.SetStateAction<(PayrollModel & { key: number }) | null>>;
};

export const DetailModal = ({ data, setData }: Props) => {
  const handleCancel = () => {
    setData(null);
  };

  if (data === null) return null;

  const TOTAL_INCOME =
    data.BaseSalaryPerHours * (data.RealWorkingHours + data.DayOfHasSalary * 8) +
    data.OTSalaryPerHours * data.OTWorkingHours;

  return (
    <Modal
      open={data !== null}
      footer={null}
      onCancel={handleCancel}
      width={800}
    >
      <div>
        <Title
          level={4}
          style={{
            textAlign: "center",
            color: "rgba(253,29,29,1)",
          }}
        >
          Payroll
        </Title>
        <Title
          level={5}
          style={{ textAlign: "center", marginTop: 0 }}
        >
          Month: <span style={{ color: "purple" }}>{dayjs(data.StartDate).format("MM/YYYY")}</span>
        </Title>
        <div style={{ display: "flex", gap: "1rem" }}>
          <div
            style={{
              width: "50%",
            }}
          >
            <table
              style={{
                margin: 0,
              }}
            >
              <tbody>
                <tr>
                  <td style={{ fontWeight: "600", textAlign: "start", paddingRight: "2rem" }}>Employee Code:</td>
                  <td>{data.Contract.User.EmployeeCode}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "600", textAlign: "start", paddingRight: "2rem" }}>Full name:</td>
                  <td>{data.Contract.User.EmployeeName}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "600", textAlign: "start", paddingRight: "2rem" }}>Job title:</td>
                  <td>
                    {data.Contract.Level.LevelName} {data.Contract.Position.PositionName}
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "600", textAlign: "start", paddingRight: "2rem" }}>Hired date:</td>
                  <td>{dayjs(data.Contract.StartDate).format("DD/MM/YYYY")}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "600", textAlign: "start", paddingRight: "2rem" }}>Type:</td>
                  <td>{data.Contract.EmployeeType}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            style={{
              width: "50%",
            }}
          >
            <table
              style={{
                margin: 0,
                float: "right",
              }}
            >
              <tbody>
                {+EmployeeType[data.Contract.EmployeeType] === EmployeeType.FullTime ? (
                  <>
                    <tr>
                      <td style={{ fontWeight: "600", textAlign: "start", paddingRight: "2rem" }}>
                        Standard WK hours:
                      </td>
                      <td>{data.BaseWorkingHours}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: "600", textAlign: "start", paddingRight: "2rem" }}>Actual WK hours:</td>
                      <td>{data.RealWorkingHours}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: "600", textAlign: "start", paddingRight: "2rem" }}>OT WK hours:</td>
                      <td>{data.OTWorkingHours}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: "600", textAlign: "start", paddingRight: "2rem" }}>Paid leave hours:</td>
                      <td>{data.DayOfHasSalary * 8}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: "600", textAlign: "start", paddingRight: "2rem" }}>
                        Unpaid leave hours:
                      </td>
                      <td>{data.BaseWorkingHours - data.RealWorkingHours - data.DayOfHasSalary * 8}</td>
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td style={{ fontWeight: "600", textAlign: "start", paddingRight: "2rem" }}>Actual WK hours:</td>
                    <td>{data.RealWorkingHours}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div
          style={{
            background: "linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 50%, rgba(252,176,69,1) 100%)",
            color: "white",
            margin: "1rem 0",
            textAlign: "center",
            padding: "0.5rem 0",
            textTransform: "uppercase",
            fontWeight: "600",
          }}
        >
          Salary Description
        </div>
        <table
          style={{
            width: "100%",
            fontWeight: "600",
          }}
        >
          <tbody>
            <tr>
              <td
                style={{ color: "purple" }}
                width="24px"
              >
                (A)
              </td>
              <td
                style={{ color: "purple" }}
                width="60%"
              >
                {data.Contract.SalaryType} Basic Salary
              </td>
              <td
                style={{ textAlign: "end" }}
                width="calc(100% - 60% - 24px)"
              >
                {formatMoney.format(data.Contract.BaseSalary)}
              </td>
            </tr>
            <tr>
              <td style={{ color: "purple" }}>(B)</td>
              <td style={{ color: "purple" }}>Total Income</td>
              <td style={{ textAlign: "end" }}>{formatMoney.format(TOTAL_INCOME)}</td>
            </tr>
            <tr>
              <td></td>
              <td>1. Actual Working</td>
              <td style={{ textAlign: "end" }}>
                {formatMoney.format(data.BaseSalaryPerHours)} * ({data.RealWorkingHours} + {data.DayOfHasSalary * 8}) ={" "}
                {formatMoney.format(data.BaseSalaryPerHours * (data.RealWorkingHours + data.DayOfHasSalary * 8))}
              </td>
            </tr>
            {+EmployeeType[data.Contract.EmployeeType] === EmployeeType.FullTime && (
              <tr>
                <td></td>
                <td>2. OT Working</td>
                <td style={{ textAlign: "end" }}>
                  {formatMoney.format(data.OTSalaryPerHours)} * {data.OTWorkingHours} ={" "}
                  {formatMoney.format(data.OTSalaryPerHours * data.OTWorkingHours)}
                </td>
              </tr>
            )}
            <tr>
              <td style={{ color: "purple" }}>(C)</td>
              <td style={{ color: "purple" }}>Deduction</td>
              <td style={{ textAlign: "end" }}>{formatMoney.format(data.Tax ? TOTAL_INCOME * (data.Tax / 100) : 0)}</td>
            </tr>
            <tr>
              <td></td>
              <td>1. Tax</td>
              <td style={{ textAlign: "end" }}>
                (B) * {data.Contract.TaxRate}% = {formatMoney.format(TOTAL_INCOME * (data.Contract.TaxRate / 100))}
              </td>
            </tr>
            <tr>
              <td></td>
              <td>2. Insurance</td>
              <td style={{ textAlign: "end" }}>
                (B) * {data.Contract.TaxRate}% ={" "}
                {formatMoney.format(TOTAL_INCOME * (data.Contract.InsuranceRate / 100))}
              </td>
            </tr>
            <tr>
              <td style={{ color: "purple" }}>(D)</td>
              <td style={{ color: "purple" }}>Net Take Home (B - C)</td>
              <td style={{ textAlign: "end" }}>{formatMoney.format(data.Total)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        <p
          style={{
            fontWeight: "600",
          }}
        >
          Status:{" "}
        </p>{" "}
        <PayrollStatusTag status={data.Status} />
      </div>
    </Modal>
  );
};
