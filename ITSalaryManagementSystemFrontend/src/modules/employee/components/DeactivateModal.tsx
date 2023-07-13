import { useState } from "react";

import { Button, Modal, message } from "antd";

import EmployeeApis from "../apis/EmployeeApis";
import { EmployeeModel } from "../models";

type Props = {
  data: EmployeeModel;
  successCallback?: () => void;
};

export const DeactivateModal = ({ data, successCallback }: Props) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [sending, setSending] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setSending(true);
    EmployeeApis.deactivate(data.Id)
      .then(() => {
        setIsModalOpen(false);
        successCallback?.();
      })
      .catch((error) => {
        console.error(error);
        if (error.response?.status === 400) {
          messageApi.open({
            type: "error",
            content: error.response?.data?.message,
          });
        } else {
          messageApi.open({
            type: "error",
            content: "Create payroll failed! Please refresh page and try again!",
          });
        }
      })
      .finally(() => setSending(false));
  };

  const handleCancel = () => {
    if (sending) return;
    setIsModalOpen(false);
  };

  return (
    <>
      {contextHolder}
      <Button
        type="primary"
        style={{
          backgroundColor: "#2D4356",
        }}
        onClick={showModal}
      >
        Deactivate
      </Button>
      <Modal
        title="Warning"
        open={isModalOpen}
        onOk={handleOk}
        okButtonProps={{
          danger: true,
          loading: sending,
        }}
        cancelButtonProps={{
          disabled: sending,
        }}
        onCancel={handleCancel}
      >
        <p>
          Are you sure to deactivate employee "{data.EmployeeCode} - {data.EmployeeName}"
        </p>
      </Modal>
    </>
  );
};
