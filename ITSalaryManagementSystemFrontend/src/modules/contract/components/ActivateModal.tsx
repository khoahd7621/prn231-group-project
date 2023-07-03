import { useState } from "react";

import { Button, Modal } from "antd";

import { ContractModel } from "../models";
import ContractApis from "../apis/ContractApis";

type Props = {
  data: ContractModel;
  successCallback?: () => void;
};

export const ActivateModal = ({ data, successCallback }: Props) => {
  const [sending, setSending] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setSending(true);
    ContractApis.activate(data.Id)
      .then(() => {
        setIsModalOpen(false);
        successCallback?.();
      })
      .catch((err) => {
        console.log(err);
        alert("Something went wrong! Please refresh page and try again later.");
      })
      .finally(() => setSending(false));
  };

  const handleCancel = () => {
    if (sending) return;
    setIsModalOpen(false);
  };

  return (
    <>
      <Button
        type="primary"
        style={{
          backgroundColor: "#52c41a",
        }}
        onClick={showModal}
      >
        Activate
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
          Are you sure to activate contract of employee "{data.User.EmployeeCode} - {data.User.EmployeeName}"
        </p>
      </Modal>
    </>
  );
};
