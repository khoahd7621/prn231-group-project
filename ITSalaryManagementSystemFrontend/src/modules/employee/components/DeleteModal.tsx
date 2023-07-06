import { useState } from "react";

import { Button, Modal, message } from "antd";

import EmployeeApis from "../apis/EmployeeApis";
import { EmployeeModel } from "../models";

type Props = {
  data: EmployeeModel;
  successCallback?: () => void;
};

export const DeleteModal = ({ data, successCallback }: Props) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [sending, setSending] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setSending(true);
    EmployeeApis.delete(data.Id)
      .then(() => {
        setIsModalOpen(false);
        successCallback?.();
      })
      .catch((err) => {
        console.error(err);
        messageApi.open({
          type: "error",
          content: "Something went wrong! Please refresh page and try again later.",
        });
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
        danger
        onClick={showModal}
      >
        Delete
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
          Are you sure to delete employee "{data.EmployeeCode} - {data.EmployeeName}"
        </p>
      </Modal>
    </>
  );
};
