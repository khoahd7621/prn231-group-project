import { useEffect, useState } from "react";

import { Button, Form, Input, Modal, message } from "antd";

import PositionApis from "../apis/PositionApis";
import { PositionModel } from "../models";

type Props = {
  data: PositionModel;
  successCallback?: () => void;
};

export const EditModal = ({ data, successCallback }: Props) => {
  const [form] = Form.useForm();
  const values = Form.useWatch([], form);
  const [messageApi, contextHolder] = message.useMessage();
  const [submittable, setSubmittable] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    form.validateFields({ validateOnly: true }).then(
      () => {
        setSubmittable(true);
      },
      () => {
        setSubmittable(false);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setSending(true);
    PositionApis.put(data.Id, { positionName: values.positionName })
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
      });
    setSending(false);
  };

  const handleCancel = () => {
    if (sending) return;
    setIsModalOpen(false);
    form.setFieldValue("positionName", data.PositionName);
  };

  return (
    <>
      {contextHolder}
      <Button
        type="primary"
        onClick={showModal}
      >
        Edit
      </Button>
      <Modal
        title="Edit position"
        open={isModalOpen}
        onOk={handleOk}
        okButtonProps={{
          disabled:
            !submittable ||
            form.isFieldTouched("positionName") === false ||
            String(form.getFieldValue("positionName")).trim() === data.PositionName,
          htmlType: "submit",
          loading: sending,
        }}
        cancelButtonProps={{
          disabled: sending,
        }}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          disabled={sending}
          initialValues={{
            positionName: data.PositionName,
          }}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          style={{ maxWidth: 600, margin: "2rem 0" }}
          autoComplete="off"
        >
          <Form.Item
            label="Position name"
            name="positionName"
            rules={[{ required: true, message: "Please input position name!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
