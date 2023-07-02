import { Tag } from "antd";

import { AttendanceStatus } from "../../../constants/enum";

type Props = {
  status: AttendanceStatus;
};

export function AttendanceStatusTag({ status }: Props) {
  const currentStatus =+AttendanceStatus[status];

  switch (currentStatus) {
    case AttendanceStatus.Approved.valueOf():
      return <Tag color="green">Approved</Tag>;
    case AttendanceStatus.Deleted.valueOf():
      return <Tag color="red">Is Deleted</Tag>;
    case AttendanceStatus.Rejected.valueOf():
      return <Tag color="geekblue">Rejected</Tag>;
    case AttendanceStatus.Waiting.valueOf():
      return <Tag color="yellow">Waiting</Tag>;
    default:
      return <Tag color="magenta">Unknown</Tag>;
  }
}
