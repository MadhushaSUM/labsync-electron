import { Button, Card, Flex, message, Space } from "antd";
import { useNavigate } from "react-router-dom";

import {
    DatePicker,
    Form,
    Input,
    Select,
} from 'antd';

type AddPatientFormType = Omit<Patient, "contact_number"> & {
    contact_number: {
        prefix: string;
        number: string;
    }
}

const AddPatient = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const clickCancelBtn = () => {
        navigate('/patients');
    }

    const onFormSubmit = async (formData: AddPatientFormType) => {
        let newPatient: Omit<Patient, "id"> = {
            name: formData.name,
            gender: formData.gender,
            date_of_birth: new Date(formData.date_of_birth),
        }
        if (formData.contact_number.number !== undefined || "") {
            newPatient.contact_number = formData.contact_number.prefix + formData.contact_number.number;
        }

        messageApi.open({
            key: "saving_message",
            type: "loading",
            content: "Saving patient..."
        });

        try {
            const res = await window.electron.patients.insert(newPatient);

            if (res.success) {
                messageApi.open({
                    key: "saving_message",
                    type: "success",
                    content: "New patient saved!",
                    duration: 2
                });
            } else {
                messageApi.open({
                    key: "saving_message",
                    type: "error",
                    content: "Error occurred while saving the new patient!",
                    duration: 3
                });
            }
        } catch (error) {
            messageApi.open({
                key: "saving_message",
                type: "error",
                content: "Error occurred while saving the new patient!",
                duration: 3
            });
        }
    }

    return (
        <div>
            {contextHolder}
            <Card
                title="Add Patients"
                actions={[
                    <Flex justify="end" gap="small">
                        <Button color="default" variant="solid" onClick={clickCancelBtn}>Go back</Button>
                    </Flex>
                ]}
            >
                <div>
                    <Form
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 14 }}
                        layout="horizontal"
                        style={{ maxWidth: 600 }}
                        onFinish={onFormSubmit}
                        initialValues={{ contact_number: { prefix: "+94" } }}
                    >
                        <Form.Item<AddPatientFormType>
                            label="Name"
                            name="name"
                            required
                            rules={[{ required: true, message: 'Please input patient name!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<AddPatientFormType>
                            label="Gender"
                            name="gender"
                            required
                            rules={[{ required: true, message: 'Please select patient gender!' }]}
                        >
                            <Select>
                                <Select.Option value="Male">Male</Select.Option>
                                <Select.Option value="Female">Female</Select.Option>
                                <Select.Option value="Other">Other</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item<AddPatientFormType>
                            label="Date of birth"
                            name="date_of_birth"
                            required
                            rules={[{ required: true, message: 'Please select patient date of birth!' }]}
                        >
                            <DatePicker />
                        </Form.Item>

                        <Form.Item<AddPatientFormType>
                            label="Contact number"
                        >
                            <Space.Compact>
                                <Form.Item<AddPatientFormType>
                                    name={["contact_number", "prefix"]}
                                    noStyle
                                >
                                    <Input style={{ width: '20%' }} />
                                </Form.Item>
                                <Form.Item<AddPatientFormType>
                                    name={["contact_number", "number"]}
                                    noStyle
                                    hasFeedback
                                    validateDebounce={500}
                                    rules={[{ len: 9, message: 'Please enter a valid contact number!' }]}
                                >
                                    <Input style={{ width: '80%' }} />
                                </Form.Item>
                            </Space.Compact>
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                Add patient
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Card >
        </div >
    );
};

export default AddPatient;