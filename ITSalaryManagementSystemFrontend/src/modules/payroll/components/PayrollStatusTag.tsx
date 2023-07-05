import { CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Tag } from "antd";

import { PayrollStatus } from "../../../constants/enum";

type Props = {
  status: PayrollStatus;
};

export function PayrollStatusTag({ status }: Props) {
  const currentStatus = +PayrollStatus[status];

  switch (currentStatus) {
    case PayrollStatus.Waiting.valueOf():
      return (
        <Tag
          icon={<ClockCircleOutlined />}
          color="default"
        >
          Waiting
        </Tag>
      );
    case PayrollStatus.Approved.valueOf():
      return (
        <Tag
          icon={<CheckCircleOutlined />}
          color="#389e0d"
        >
          Approved
        </Tag>
      );
    case PayrollStatus.Rejected.valueOf():
      return (
        <Tag
          icon={<ExclamationCircleOutlined />}
          color="#ff4d4f"
        >
          Rejected
        </Tag>
      );
    default:
      return <Tag color="magenta">Unknown</Tag>;
  }
}
