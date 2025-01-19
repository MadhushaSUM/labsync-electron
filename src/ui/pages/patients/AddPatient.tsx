import { Button, Card, Flex, message, Space } from "antd";
import { useNavigate } from "react-router-dom";

import {
    DatePicker,
    Form,
    Input,
    Select,
} from 'antd';
import { calculateDateOfBirth } from "../../lib/utils";
import dayjs from "dayjs";

type AddPatientFormType = Omit<Patient, "contact_number"> & {
    contact_number: {
        prefix: string;
        number: string;
    }
}

const AddPatient = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const clickCancelBtn = () => {
        navigate('/patients');
    }

    const handleSimpleDateOfBirth = (value: string) => {
        const matchArr = value.match(new RegExp(/^(\d+y\s?)?(\d+m\s?)?(\d+d\s?)?$/));
        let years = 0;
        let months = 0;
        let days = 0;

        if (matchArr) {
            if (matchArr[1]) {
                years = Number(matchArr[1].split('y')[0]);
            }
            if (matchArr[2]) {
                months = Number(matchArr[2].split('m')[0]);
            }
            if (matchArr[3]) {
                days = Number(matchArr[3].split('d')[0]);
            }

            const dateOfBirth = calculateDateOfBirth(years, months, days);
            form.setFieldValue("date_of_birth", dayjs(dateOfBirth));
        }
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
                        form={form}
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
                        >
                            <Space>
                                <Form.Item
                                    name="simpleDateOfBirth"
                                    rules={[
                                        {
                                            required: false,
                                            pattern: /^(\d+y\s?)?(\d+m\s?)?(\d+d\s?)?$/,
                                            message: "Wrong format!",
                                        },
                                    ]}
                                >
                                    <Input
                                        style={{ width: 150 }}
                                        placeholder="00y 00m 00d"
                                        onChange={(e) => handleSimpleDateOfBirth(e.target.value)}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="date_of_birth"
                                    required
                                    rules={[{ required: true, message: 'Please select patient date of birth!' }]}
                                >
                                    <DatePicker />
                                </Form.Item>
                            </Space>
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