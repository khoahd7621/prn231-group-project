import dayjs from "dayjs";
import { useState } from "react";

import { Button, Modal, Radio, RadioChangeEvent, Tag } from "antd";

import { AttendanceStatus } from "../../../constants/enum";
import AttendanceApis from "../apis/AttendanceApis";
import { AttendanceModel } from "../models";

type Props = {
  data: AttendanceModel;
  successCallback?: () => void;
};

export const ModifierStatusModal = ({ data, successCallback }: Props) => {
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

  const onChange = (e: RadioChangeEvent) => {
    console.log(`radio checked:${e.target.value}`);
  };

  return (
    <>
      <Button
        type="primary"
        onClick={showModal}
      >
        Modify Status
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
          Are you sure to modifier:<p></p>
          <Tag color="orange">{(data.User as any).EmployeeName} </Tag>
          <Tag color="orange">{dayjs(data.Date).format("HH:mm | YYYY-MM-DD ")} </Tag>
          <Radio.Group
            onChange={onChange}
            defaultValue="a"
            style={{ marginTop: 16 }}
          >
            <Radio.Button value={AttendanceStatus.Waiting}>{AttendanceStatus[0]}</Radio.Button>
            <Radio.Button value={AttendanceStatus.Approved}>{AttendanceStatus[1]}</Radio.Button>
            <Radio.Button value={AttendanceStatus.Rejected}>{AttendanceStatus[2]}</Radio.Button>
          </Radio.Group>
        </p>
      </Modal>
    </>
  );
};
