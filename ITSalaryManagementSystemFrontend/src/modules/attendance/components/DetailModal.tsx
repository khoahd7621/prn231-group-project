import { Badge, Button, Descriptions, Modal } from "antd";
import dayjs from "dayjs";

import { AttendanceStatusTag } from ".";
import { AttendanceModel } from "../models";
import { useEffect, useState } from "react";
import { EmployeeStatusTag } from "../../employee/components";
import { AttendanceType } from "../../../constants/enum";

type Props = {
  data: (AttendanceModel & { key: number }) | null;
  setData: React.Dispatch<
    React.SetStateAction<(AttendanceModel & { key: number }) | null>
  >;
};
export const DetailModal = ({ data, setData }: Props) => {
  const handleCancel = () => {
    setData(null);
  };
  if (data === null) return null;

  return (
    <>
      <Modal
        title={`Detail Attendance  ${(data.User as any).EmployeeCode} - ${(data.User as any).EmployeeName}`}
        open={data !== null}
        footer={null}
        width="80%"
        onCancel={handleCancel}
      >
        <Descriptions
          title="Employee Info"
          size="default"
          layout="vertical"
          //bordered
          column={{ xxl: 6, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
        >
          <Descriptions.Item label="Employee Code">
            {(data.User as any).EmployeeCode}
          </Descriptions.Item>
          <Descriptions.Item label="Employee Name">
            {(data.User as any).EmployeeName}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {(data.User as any).Email}
          </Descriptions.Item>
          <Descriptions.Item label="Phone">
            {(data.User as any).Phone}
          </Descriptions.Item>
          <Descriptions.Item label="Address">
            {(data.User as any).Address}
          </Descriptions.Item>
          <Descriptions.Item label="Role">
            {(data.User as any).Role}
          </Descriptions.Item>
          <Descriptions.Item label="CCCD">
            {(data.User as any).CCCD}
          </Descriptions.Item>
          <Descriptions.Item label="Gender">
            {(data.User as any).Gender}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <EmployeeStatusTag status={(data.User as any).Status} />
          </Descriptions.Item>
        </Descriptions>
        {/* ========================================= */}
        <Descriptions
          title="Attendance Info"
          size="default"
          // layout="vertical"
          //bordered
          column={5}
        >
          <Descriptions.Item label="Date of work">
           {dayjs(data.Date).format("HH:mm | YYYY-MM-DD ")}
          </Descriptions.Item>
          <Descriptions.Item label="Number Hour">{data.Hour}</Descriptions.Item>
          <Descriptions.Item label="Number OT Hour">
            {data.OTHour}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <AttendanceStatusTag status={(data as any).Status} />
          </Descriptions.Item>
          <Descriptions.Item label="Type">{AttendanceType[data.Type]}</Descriptions.Item>
        </Descriptions>
      </Modal>
    </>
  );
};
