import { Button, Form, message, Select } from "antd";
import { useEffect, useState } from "react";
import pkg from 'pdf-to-printer';

const { Option } = Select;

const PrinterSettings = () => {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [allPrinters, setAllPrinters] = useState<pkg.Printer[]>([]);

    const fetchPrinters = async () => {
        const { printers } = await window.electron.printers.get();
        setAllPrinters(printers);
    }

    const loadConfig = async () => {
        const { receiptPrinter, reportPrinter } = await window.electron.printers.getSavedPrinters();
        form.setFieldValue('report_printer', reportPrinter);
        form.setFieldValue('receipt_printer', receiptPrinter);
    }

    const onFinish = async (values: any) => {
        const data = {
            report_printer: values.report_printer,
            receipt_printer: values.receipt_printer
        }

        try {
            messageApi.open({
                key: "updating_message",
                type: "loading",
                content: "Updating preferred printers..."
            });

            const res = await window.electron.printers.save(data);

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
        fetchPrinters();
        loadConfig();
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
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item
                    label="Report printer"
                    name="report_printer"
                    rules={[{ required: true, message: 'Please select a preferred printer!' }]}
                >
                    <Select>
                        {allPrinters.map(printer => (
                            <Option key={printer.name}>{printer.name}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Receipt printer"
                    name="receipt_printer"
                    rules={[{ required: true, message: 'Please select a preferred printer!' }]}
                >
                    <Select>
                        {allPrinters.map(printer => (
                            <Option key={printer.name}>{printer.name}</Option>
                        ))}
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

export default PrinterSettings;