import { Modal, Tag, Typography } from "antd";
import dayjs from "dayjs";

import { EmployeeStatusTag, RenderAvatar } from ".";
import { ContractStatus, Gender } from "../../../constants/enum";
import { ContractDetail } from "../../contract/components";
import { EmployeeModel } from "../models";

const { Title } = Typography;

type Props = {
  data: (EmployeeModel & { key: number }) | null;
  setData: React.Dispatch<React.SetStateAction<(EmployeeModel & { key: number }) | null>>;
};

export const DetailModal = ({ data, setData }: Props) => {
  const handleCancel = () => {
    setData(null);
  };

  if (data === null) return null;

  const activeContract = data.Contracts.find((item) => +ContractStatus[item.Status] === ContractStatus.Active);
  if (activeContract) activeContract.User = data;

  return (
    <Modal
      title={`Detail employee ${data.EmployeeCode} - ${data.EmployeeName}`}
      open={data !== null}
      footer={null}
      onCancel={handleCancel}
      width={800}
    >
      <div
        style={{
          marginTop: "1rem",
          display: "flex",
          gap: "4rem",
        }}
      >
        <div
          style={{
            width: "50%",
          }}
        >
          <Title level={4}>Basic information</Title>
          <div
            style={{
              marginBottom: "1rem",
            }}
          >
            <RenderAvatar
              shape="square"
              size={100}
              gender={data !== null ? data.Gender : Gender.Male}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.2rem",
            }}
          >
            <strong>Staff code:</strong> {data.EmployeeCode}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.2rem",
            }}
          >
            <strong>Full Name:</strong> {data.EmployeeName}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.2rem",
            }}
          >
            <strong>Date of birth:</strong> {dayjs(data.Dob).format("DD/MM/YYYY")}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.2rem",
            }}
          >
            <strong>Phone:</strong> {data.Phone}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.2rem",
            }}
          >
            <strong>Email:</strong> {data.Email}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.2rem",
            }}
          >
            <strong>Address:</strong> {data.Address}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.2rem",
            }}
          >
            <strong>Join date:</strong> {dayjs(data.CreatedDate).format("DD/MM/YYYY")}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.2rem",
            }}
          >
            <strong>Status:</strong> <EmployeeStatusTag status={data.Status} />
          </div>
        </div>
        <div
          style={{
            width: "50%",
          }}
        >
          <Title level={4}>Contract information</Title>
          {activeContract ? <ContractDetail data={activeContract} /> : <Tag color="#2D4356">Not Available</Tag>}
        </div>
      </div>
    </Modal>
  );
};
