import { useEffect, useState } from "react";

import { Button, Form, Input, Modal } from "antd";

import LevelApis from "../apis/LevelApis";
import { LevelModel } from "../models";

type Props = {
  data: LevelModel;
  successCallback?: () => void;
};

export const EditModal = ({ data, successCallback }: Props) => {
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
    LevelApis.put(data.Id, { levelName: values.levelName })
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
    form.setFieldValue("levelName", data.LevelName);
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
        title="Edit level"
        open={isModalOpen}
        onOk={handleOk}
        okButtonProps={{
          disabled:
            !submittable ||
            form.isFieldTouched("levelName") === false ||
            String(form.getFieldValue("levelName")).trim() === data.LevelName,
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
            levelName: data.LevelName,
          }}
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
