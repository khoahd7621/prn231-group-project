import { Tag } from "antd";

import { EmployeeStatus } from "../../../constants/enum";

type Props = {
  status: EmployeeStatus;
};

export function EmployeeStatusTag({ status }: Props) {
  const currentStatus = +EmployeeStatus[status];

  switch (currentStatus) {
    case EmployeeStatus.Active.valueOf():
      return <Tag color="green">Active</Tag>;
    case EmployeeStatus.Passive.valueOf():
      return <Tag color="geekblue">In Active</Tag>;
    case EmployeeStatus.Deleted.valueOf():
      return <Tag color="red">Deleted</Tag>;
    default:
      return <Tag color="magenta">Unknown</Tag>;
  }
}
