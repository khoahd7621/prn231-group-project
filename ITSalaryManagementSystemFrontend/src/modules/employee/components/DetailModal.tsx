import { Modal } from "antd";
import dayjs from "dayjs";

import { EmployeeStatusTag } from ".";
import { EmployeeModel } from "../models";

type Props = {
  data: (EmployeeModel & { key: number }) | null;
  setData: React.Dispatch<React.SetStateAction<(EmployeeModel & { key: number }) | null>>;
};

export const DetailModal = ({ data, setData }: Props) => {
  const handleCancel = () => {
    setData(null);
  };

  if (data === null) return null;

  return (
    <Modal
      title={`Detail employee ${data.EmployeeCode} - ${data.EmployeeName}`}
      open={data !== null}
      footer={null}
      onCancel={handleCancel}
    >
      <div>
        <strong>Staff code:</strong> {data.EmployeeCode}
      </div>
      <div>
        <strong>Full Name:</strong> {data.EmployeeName}
      </div>
      <div>
        <strong>Date of birth:</strong> {dayjs(data.Dob).format("DD/MM/YYYY")}
      </div>
      <div>
        <strong>Phone:</strong> {data.Phone}
      </div>
      <div>
        <strong>Email:</strong> {data.Email}
      </div>
      <div>
        <strong>Address:</strong> {data.Address}
      </div>
      <div>
        <strong>Join date:</strong> {dayjs(data.CreatedDate).format("DD/MM/YYYY")}
      </div>
      <div>
        <strong>Job title:</strong> N/a
      </div>
      <div>
        <strong>Current contract:</strong> N/a
      </div>
      <div>
        <strong>Status:</strong> <EmployeeStatusTag status={data.Status} />
      </div>
    </Modal>
  );
};
