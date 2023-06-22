import { useState } from "react";

import { Button, Modal } from "antd";

import PositionApis from "../apis/PositionApis";
import { PositionModel } from "../models";

type Props = {
  data: PositionModel;
  successCallback?: () => void;
};

export const DeleteModal = ({ data, successCallback }: Props) => {
  const [sending, setSending] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setSending(true);
    PositionApis.delete(data.Id)
      .then(() => {
        setIsModalOpen(false);
        successCallback?.();
      })
      .catch((err) => {
        console.log(err);
        alert("Something went wrong! Please refresh page and try again later.");
      });
    setSending(false);
  };

  const handleCancel = () => {
    if (sending) return;
    setIsModalOpen(false);
  };

  return (
    <>
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
        <p>Are you sure to delete position "{data.PositionName}"</p>
      </Modal>
    </>
  );
};
