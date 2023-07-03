import { Tag } from "antd";

import { EmployeeType } from "../../../constants/enum";

type Props = {
  type: EmployeeType;
};

export function EmployeeTypeTag({ type }: Props) {
  const currentType = +EmployeeType[type];

  switch (currentType) {
    case EmployeeType.FullTime.valueOf():
      return <Tag color="#3b5999">Full-time</Tag>;
    case EmployeeType.PartTime.valueOf():
      return <Tag color="#cd201f">Part-time</Tag>;
    default:
      return <Tag color="magenta">Unknown</Tag>;
  }
}
