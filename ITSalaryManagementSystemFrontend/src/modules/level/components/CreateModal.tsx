import { useEffect, useState } from "react";

import { Button, Form, Input, Modal, message } from "antd";
import LevelApis from "../apis/LevelApis";

type Props = {
  successCallback?: () => void;
};

export const CreateModal = ({ successCallback }: Props) => {
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
    LevelApis.post({ levelName: values.levelName })
      .then(() => {
        form.resetFields();
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
    form.resetFields();
  };

  return (
    <>
      {contextHolder}
      <Button
        type="primary"
        onClick={showModal}
      >
        Create new level
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
