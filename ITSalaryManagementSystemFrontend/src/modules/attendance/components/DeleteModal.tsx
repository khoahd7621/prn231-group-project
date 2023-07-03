import dayjs from "dayjs";
import { useState } from "react";

import { Button, Modal, Tag } from "antd";

import AttendanceApis from "../apis/AttendanceApis";
import { AttendanceModel } from "../models";

type Props = {
  data: AttendanceModel;
  isDisable: boolean;
  successCallback?: () => void;
};

export const DeleteModal = ({ data, isDisable, successCallback }: Props) => {
  const [sending, setSending] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setSending(true);
    AttendanceApis.delete(data.Id)
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
        disabled={isDisable}
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
          Are you sure to delete:<p></p>
          <Tag color="orange">{(data.User as any).EmployeeName} </Tag>
          <Tag color="orange">{dayjs(data.Date).format("HH:mm | YYYY-MM-DD ")}</Tag>
        </p>
      </Modal>
    </>
  );
};
