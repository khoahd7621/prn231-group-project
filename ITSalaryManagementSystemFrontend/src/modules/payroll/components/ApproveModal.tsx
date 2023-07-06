import { useState } from "react";

import { Button, Modal, message } from "antd";

import dayjs from "dayjs";
import PayrollApis from "../apis/PayrollApis";
import { PayrollModel } from "../models/PayrollModel";

type Props = {
  data: PayrollModel;
  successCallback?: () => void;
};

export const ApproveModal = ({ data, successCallback }: Props) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [sending, setSending] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setSending(true);
    PayrollApis.approve(data.Id)
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
        onClick={showModal}
        style={{
          backgroundColor: "#52c41a",
        }}
      >
        Approve
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
        <p>Are you sure to approve payroll in month "{dayjs(data.CreatedDate).format("MM/YYYY")}"</p>
      </Modal>
    </>
  );
};
