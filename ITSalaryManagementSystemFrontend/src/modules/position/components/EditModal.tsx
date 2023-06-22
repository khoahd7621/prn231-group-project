import { useEffect, useState } from "react";

import { Button, Form, Input, Modal } from "antd";

import { PositionModel } from "../models";

type Props = {
  data: PositionModel;
};

export const EditModal = ({ data }: Props) => {
  const [form] = Form.useForm();
  const values = Form.useWatch([], form);
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
    setTimeout(() => {
      setIsModalOpen(false);
      setSending(false);
    }, 5000);
  };

  const handleCancel = () => {
    if (sending) return;
    setIsModalOpen(false);
    form.setFieldValue("positionName", data.positionName);
  };

  return (
    <>
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
            String(form.getFieldValue("positionName")).trim() === data.positionName,
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
          name="basic"
          disabled={sending}
          initialValues={{
            positionName: data.positionName,
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
