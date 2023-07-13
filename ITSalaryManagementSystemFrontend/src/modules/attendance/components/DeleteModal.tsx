import dayjs from "dayjs";
import { useState } from "react";

import { Button, Modal, Tag, notification } from "antd";

import AttendanceApis from "../apis/AttendanceApis";
import { AttendanceModel } from "../models";

type Props = {
  data: AttendanceModel;
  successCallback?: () => void;
};

type NotificationType = "success" | "info" | "warning" | "error";
export const DeleteModal = ({ data, successCallback }: Props) => {
  const [sending, setSending] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type: NotificationType, message: string, description: string) => {
    api[type]({
      message: message,
      description: description,
      duration: 1,
    });
  };
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setSending(true);
    AttendanceApis.delete(data.Id)
      .then(() => {
        setIsModalOpen(false);
        successCallback?.();
        openNotificationWithIcon("success", "Delete", "Delete attendance success");
      })
      .catch((error) => {
        console.error(error);
        openNotificationWithIcon("error", "Delete", error.response.data?.error.message);
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
          Are you sure to delete:<p></p>
          <Tag color="orange">{(data.User as any).EmployeeName} </Tag>
          <Tag color="orange">{dayjs(data.Date).format("HH:mm | YYYY-MM-DD ")}</Tag>
        </p>
      </Modal>
    </>
  );
};
