import { useState } from "react";

import { Button, Modal } from "antd";

import LevelApis from "../apis/LevelApis";
import { LevelModel } from "../models";

type Props = {
  data: LevelModel;
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
    LevelApis.delete(data.Id)
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
        <p>Are you sure to delete level "{data.LevelName}"</p>
      </Modal>
    </>
  );
};
