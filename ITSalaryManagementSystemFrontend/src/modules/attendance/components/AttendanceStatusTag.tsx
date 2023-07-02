import { Tag } from "antd";

import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { AttendanceStatus } from "../../../constants/enum";

type Props = {
  status: AttendanceStatus;
};

export function AttendanceStatusTag({ status }: Props) {
  const currentStatus = +AttendanceStatus[status];

  switch (currentStatus) {
    case AttendanceStatus.Approved.valueOf():
      return (
        <Tag icon={<CheckCircleOutlined />} color="success">
          Approved
        </Tag>
      );
    case AttendanceStatus.Rejected.valueOf():
      return (
        <Tag icon={<CloseCircleOutlined />} color="error">
          Rejected
        </Tag>
      );
    case AttendanceStatus.Waiting.valueOf():
      return (
        <Tag icon={<ClockCircleOutlined />} color="default">
          Waiting
        </Tag>
      );
    default:
      return <Tag color="magenta">Unknown</Tag>;
  }
}
