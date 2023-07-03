import { Tag } from "antd";

import { LeaveStatus } from "../../../constants/enum";

type Props = {
    status: LeaveStatus;
};

export function LeaveStatusTag({ status }: Props) {
    const currentStatus = +LeaveStatus[status];

    switch (currentStatus) {
        case LeaveStatus.APPROVED.valueOf():
            return <Tag color="success">Approved</Tag>;
        case LeaveStatus.WAITING.valueOf():
            return <Tag color="warning">Waiting</Tag>;
        case LeaveStatus.REJECTED.valueOf():
            return <Tag color="error">Rejected</Tag>;
        default:
            return <Tag color="magenta">Deleted</Tag>;
    }
}
