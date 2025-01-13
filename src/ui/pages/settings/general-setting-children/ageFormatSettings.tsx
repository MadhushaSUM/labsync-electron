import { Button, Form, message, Select } from "antd";
import { useEffect } from "react";

const { Option } = Select;

const AgeFormatSettings = () => {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const fetchAgeFormat = async () => {
        const res = await window.electron.agePreference.get();
        console.log(res);        

        form.setFieldValue('age_format', JSON.stringify(res.age_format));
    }

    const onFinish = async (values: any) => {
        const data = {
            age_format: JSON.parse(values.age_format)
        }

        try {
            messageApi.open({
                key: "updating_message",
                type: "loading",
                content: "Updating preferred printers..."
            });

            const res = await window.electron.agePreference.save(data);

            if (!res.success) {
                messageApi.open({
                    key: "updating_message",
                    type: "error",
                    content: "Failed to update preferred printers!"
                });
            }

            messageApi.open({
                key: "updating_message",
                type: "success",
                content: "Printer configurations saved!"
            });
        } catch (error) {
            messageApi.open({
                key: "updating_message",
                type: "error",
                content: "Failed to update preferred printers!"
            });
        }
    }

    useEffect(() => {
        fetchAgeFormat();
    }, []);

    return (
        <div>
            {contextHolder}
            <Form
                form={form}
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 500 }}
                initialValues={{ age_format: '["years"]' }}
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item
                    label="Age format"
                    name="age_format"
                    rules={[{ required: true, message: 'Please select a preferred age format!' }]}
                >
                    <Select
                        allowClear
                        style={{ width: 300 }}
                    >
                        <Option value='["years"]'>years</Option>
                        <Option value='["months"]'>months</Option>
                        <Option value='["days"]'>days</Option>
                        <Option value='["months","days"]'>months and days</Option>
                        <Option value='["years","months","days"]'>years, months,and days</Option>
                    </Select>
                </Form.Item>

                <Form.Item label={null}>
                    <Button type="primary" htmlType="submit">
                        Save
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default AgeFormatSettings;