import React, { useEffect, useState } from "react";

import { Button, Form, Input, Modal } from "antd";

export const CreateModal: React.FC = () => {
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
      form.resetFields();
    }, 5000);
  };

  const handleCancel = () => {
    if (sending) return;
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <>
      <Button
        type="primary"
        onClick={showModal}
      >
        Create new position
      </Button>
      <Modal
        title="Create new level"
        open={isModalOpen}
        onOk={handleOk}
        okButtonProps={{
          disabled: !submittable || form.isFieldTouched("levelName") === false,
          htmlType: "submit",
          loading: sending,
        }}
        cancelButtonProps={{
          disabled: sending,
        }}
        onCancel={handleCancel}
      >
        <Form
          disabled={sending}
          form={form}
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          style={{ maxWidth: 600, margin: "2rem 0" }}
          autoComplete="off"
        >
          <Form.Item
            label="Level name"
            name="levelName"
            rules={[{ required: true, message: "Please input level name!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
