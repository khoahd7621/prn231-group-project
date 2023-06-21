import { useState } from "react";

import { Button, Modal } from "antd";

import { LevelModel } from "../models";

type Props = {
  data: LevelModel;
};

export const DeleteModal = ({ data }: Props) => {
  const [sending, setSending] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setSending(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setSending(false);
    }, 5000);
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
        <p>Are you sure to delete level "{data.levelName}"</p>
      </Modal>
    </>
  );
};
