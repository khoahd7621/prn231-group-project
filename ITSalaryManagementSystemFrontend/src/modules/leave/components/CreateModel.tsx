import React, { useEffect, useState } from "react";
import { Button, DatePicker, Form, Input, Modal, Select, Space } from "antd";
import LeaveApis from "../apis/LeaveApis";
import { LeaveForm } from "../models";
import moment from "moment";
import EmployeeApis from "../../employee/apis/EmployeeApis";
import { LeaveStatus } from "../../../constants/enum";
const { TextArea } = Input;

type Props = {
    successCallback?: () => void;
};

type OptionItem = {
    value: number;
    label: string;
};

export const CreateModal = ({ successCallback }: Props) => {
    const [form] = Form.useForm();
    const values = Form.useWatch([], form);
    const [submittable, setSubmittable] = useState<boolean>(false);
    const [sending, setSending] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [options, setOptions] = React.useState<OptionItem[]>([]);

    useEffect(() => {
        EmployeeApis.getAll()
            .then((res) => {
                setOptions(res.value.map((item) => ({ value: item.Id, label: item.EmployeeCode })));
            })
            .catch((err) => console.log(err));
    }, []);


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

    const handleSubmit = (value: LeaveForm) => {
        setSending(true);
        LeaveApis.post({
            ...value,
            status: LeaveStatus.WAITING,
            date: value.date.toISOString(),
        })
            .then(() => {
                setIsModalOpen(false);
                form.resetFields();
                successCallback?.();
            })
            .catch((error) => {
                console.log(error);
                alert("Create leave failed! Please refresh page and try again!");
            })
            .finally(() => setSending(false));
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
                Create new leave
            </Button>
            <Modal
                title="Create new leave"
                open={isModalOpen}
                footer={null}
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
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        label="Employee Code"
                        name="employeeId"
                        rules={[{ required: true }]}
                    >
                        <Select
                            options={options.map((key) => {
                                    return {
                                        value: key.value,
                                        label: key.label,
                                    };
                                })}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Leave Date"
                        name="date"
                        rules={[{ required: true, message: "Please input leave date!" }]}
                        initialValue={moment()}
                    >
                        <DatePicker
                            placeholder="Select leave date"
                            format={"DD/MM/YYYY"}
                            style={{
                                width: "100%",
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Type"
                        name="type"
                        rules={[
                            { required: true, message: "Please input type!" },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Reason"
                        name="reason"
                        rules={[
                            { required: true, message: "Please input reason!" },
                        ]}
                    >
                        <TextArea showCount maxLength={100}/>
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
                        <Space>
                            <Button
                                type="primary"
                                htmlType="submit"
                                disabled={!submittable || form.isFieldsTouched() === false}
                                loading={sending}
                            >
                                Submit
                            </Button>
                            <Button
                                htmlType="button"
                                onClick={() => form.resetFields()}
                            >
                                Reset
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};
