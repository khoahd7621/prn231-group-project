import { useState } from "react";

import { Button, Modal, message } from "antd";

import ContractApis from "../apis/ContractApis";
import { ContractModel } from "../models";

type Props = {
  data: ContractModel;
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
    ContractApis.delete(data.Id)
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
          Are you sure to delete contract of employee "{data.User.EmployeeCode} - {data.User.EmployeeName}"
        </p>
      </Modal>
    </>
  );
};
