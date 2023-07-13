import dayjs from "dayjs";

import { SalaryType } from "../../../constants/enum";
import { formatMoney } from "../../../utils/formatter";
import { EmployeeTypeTag } from "../../employee/components";
import { ContractModel } from "../models";

type Props = {
  data: ContractModel;
};

export function ContractDetail({ data }: Props) {
  return (
    <table style={{ width: "100%" }}>
      <tbody>
        <tr>
          <td
            style={{
              fontWeight: "600",
              width: "200px",
            }}
          >
            Employee code:
          </td>
          <td
            style={{
              padding: "3px 0",
            }}
          >
            {data.User.EmployeeCode}
          </td>
        </tr>
        <tr>
          <td
            style={{
              fontWeight: "600",
              width: "200px",
            }}
          >
            Full name:
          </td>
          <td
            style={{
              padding: "3px 0",
            }}
          >
            {data.User.EmployeeName}
          </td>
        </tr>
        <tr>
          <td
            style={{
              fontWeight: "600",
              width: "200px",
            }}
          >
            Job title:
          </td>
          <td
            style={{
              padding: "3px 0",
            }}
          >
            {data.Level.LevelName} {data.Position.PositionName}
          </td>
        </tr>
        <tr>
          <td
            style={{
              fontWeight: "600",
              width: "200px",
            }}
          >
            Hire date:
          </td>
          <td
            style={{
              padding: "3px 0",
            }}
          >
            {dayjs(data.User.CreatedDate).format("DD/MM/YYYY")}
          </td>
        </tr>
        <tr>
          <td
            style={{
              fontWeight: "600",
              width: "200px",
            }}
          >
            Employee Type:
          </td>
          <td
            style={{
              padding: "3px 0",
            }}
          >
            <EmployeeTypeTag type={data.EmployeeType} />
          </td>
        </tr>
        <tr>
          <td
            style={{
              fontWeight: "600",
              width: "200px",
            }}
          >
            Start date:
          </td>
          <td
            style={{
              padding: "3px 0",
            }}
          >
            {dayjs(data.StartDate).format("DD/MM/YYYY")}
          </td>
        </tr>
        <tr>
          <td
            style={{
              fontWeight: "600",
              width: "200px",
            }}
          >
            End date:
          </td>
          <td
            style={{
              padding: "3px 0",
            }}
          >
            {dayjs(data.EndDate).format("DD/MM/YYYY")}
          </td>
        </tr>
        <tr>
          <td
            style={{
              fontWeight: "600",
              width: "200px",
            }}
          >
            Base salary:
          </td>
          <td
            style={{
              padding: "3px 0",
            }}
          >
            {formatMoney.format(data.BaseSalary)}/{+SalaryType[data.SalaryType] === SalaryType.Gross ? "month" : "hour"}
          </td>
        </tr>
        <tr>
          <td
            style={{
              fontWeight: "600",
              width: "200px",
            }}
          >
            Salary type:
          </td>
          <td
            style={{
              padding: "3px 0",
            }}
          >
            {data.SalaryType}
          </td>
        </tr>
        <tr>
          <td
            style={{
              fontWeight: "600",
              width: "200px",
            }}
          >
            Anual day-off per year:
          </td>
          <td
            style={{
              padding: "3px 0",
            }}
          >
            {data.DateOffPerYear} days
          </td>
        </tr>
        <tr>
          <td
            style={{
              fontWeight: "600",
              width: "200px",
            }}
          >
            Tax rate:
          </td>
          <td
            style={{
              padding: "3px 0",
            }}
          >
            {data.TaxRate || 0}%
          </td>
        </tr>
        <tr>
          <td
            style={{
              fontWeight: "600",
              width: "200px",
            }}
          >
            Insurrance rate:
          </td>
          <td
            style={{
              padding: "3px 0",
            }}
          >
            {data.InsuranceRate || 0}%
          </td>
        </tr>
      </tbody>
    </table>
  );
}
