import { Tag } from "antd";

import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

import { AttendanceStatus } from "../../../constants/enum";

type Props = {
  status: any;
};

export function AttendanceStatusTag({ status }: Props) {
  const currentStatus = +AttendanceStatus[status];
  switch (currentStatus) {
    case AttendanceStatus.Approved.valueOf() || 1:
      return (
        <Tag icon={<CheckCircleOutlined />} color="success">
          Approved
        </Tag>
      );
    case AttendanceStatus.Rejected.valueOf() || 2:
      return (
        <Tag icon={<CloseCircleOutlined />} color="error">
          Rejected
        </Tag>
      );
    case AttendanceStatus.Waiting.valueOf() || 0:
      return (
        <Tag icon={<ClockCircleOutlined />} color="default">
          Waiting
        </Tag>
      );
    default:
      return <Tag color="magenta">Unknown</Tag>;
  }
}
