import { CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Tag } from "antd";

import { ContractStatus } from "../../../constants/enum";

type Props = {
  status: ContractStatus;
};

export function ContractStatusTag({ status }: Props) {
  const currentStatus = +ContractStatus[status];

  switch (currentStatus) {
    case ContractStatus.Waiting.valueOf():
      return (
        <Tag
          icon={<ClockCircleOutlined />}
          color="default"
        >
          Waiting
        </Tag>
      );
    case ContractStatus.Active.valueOf():
      return (
        <Tag
          icon={<CheckCircleOutlined />}
          color="success"
        >
          Active
        </Tag>
      );
    case ContractStatus.Expired.valueOf():
      return (
        <Tag
          icon={<ExclamationCircleOutlined />}
          color="warning"
        >
          Expired
        </Tag>
      );
    default:
      return <Tag color="magenta">Unknown</Tag>;
  }
}
