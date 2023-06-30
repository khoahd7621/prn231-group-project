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
    case EmployeeStatus.Deactive.valueOf():
      return <Tag color="geekblue">In Active</Tag>;
    default:
      return <Tag color="magenta">Unknown</Tag>;
  }
}
