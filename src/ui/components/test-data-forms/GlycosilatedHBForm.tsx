import { Button, Divider, Form, Input, message, Select, Spin } from "antd";
import { debounce } from "lodash";
import { useEffect, useState } from "react";

const { Option } = Select;

const GlycosilatedHBForm = ({ data, clearScreen }: { data: DataEmptyTests, clearScreen: () => void }) => {
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();

    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
    const [selectedDoctorId, setSelectedDoctorId] = useState<number | undefined>(undefined);

    const fetchDoctors = debounce(async (search: string) => {
        try {
            setLoading(true);
            const data = await window.electron.doctors.get(1, 5, search);
            setDoctors(data.doctors);
        } catch (error) {
            console.error("Failed to fetch doctor data:", error);
        } finally {
            setLoading(false);
        }
    }, 500);

    const handleDoctorSelect = (value: string) => {
        setSelectedDoctor(value);
        setSelectedDoctorId(doctors.find((doctor) => doctor.name === value)?.id);
    };
    const handleDoctorClear = () => {
        setSelectedDoctor(null);
        setSelectedDoctorId(undefined);
    }

    useEffect(() => {
        if (data.doctorId) {
            setSelectedDoctorId(Number(data.doctorId));
        }
    }, [data]);

    const onFinish = async (values: any) => {
        try {
            messageApi.open({
                key: "saving_message",
                type: "loading",
                content: "Saving test data..."
            });
            const savingData = {
                glycoHBValue: Number(values.glycoHBValue),
                glycoHBValueFlag: values.glycoHBValueFlag,
                meanBloodGlucoseValue: Number(values.meanBloodGlucoseValue),
                meanBloodGlucoseValueFlag: values.meanBloodGlucoseValueFlag,
                comment: values.comment
            };
            const options = {
                preferred_age_format: JSON.parse(values.ageFormat)
            }
            const res = await window.electron.testRegister.addData(data.testRegisterId, data.testId, savingData, options, selectedDoctorId);
            if (res.success) {
                clearScreen();
            } else {
                messageApi.open({
                    key: "saving_message",
                    type: "error",
                    content: "Error occurred while saving data!"
                });
            }
        } catch (error) {
            console.error(error);
            messageApi.open({
                key: "saving_message",
                type: "error",
                content: "Error occurred while saving data!"
            });
        }
    };

    return (
        <div className="w-full">
            {contextHolder}
            <p className="w-full text-lg text-center m-5 font-bold">
                Glycosilated Heamoglobin
            </p>
            <Form
                name="complex-form"
                onFinish={onFinish}
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                form={form}
                initialValues={
                    {
                        "patient": data.patientName,
                        "doctor": data.doctorName,
                        "glycoHBValue": data.data?.glycoHBValue,
                        "glycoHBValueFlag": data.data?.glycoHBValueFlag,
                        "meanBloodGlucoseValue": data.data?.meanBloodGlucoseValue,
                        "meanBloodGlucoseValueFlag": data.data?.meanBloodGlucoseValueFlag,
                        "comment": data.data?.comment,
                        "ageFormat": data.options.preferred_age_format ? JSON.stringify(data.options.preferred_age_format) : '["years"]'
                    }
                }
            >
                <Form.Item
                    name="patient"
                    label="Patient"
                >
                    <Input readOnly style={{ width: 300 }} />
                </Form.Item>

                <Form.Item
                    label="Doctor"
                    name="doctor"
                >
                    <Select
                        showSearch
                        allowClear
                        placeholder="Search for a doctor"
                        onSearch={fetchDoctors}
                        onSelect={handleDoctorSelect}
                        onClear={handleDoctorClear}
                        notFoundContent={loading ? <Spin size="small" /> : "No doctors found"}
                        filterOption={false}
                        style={{ width: 300 }}
                        value={selectedDoctor}
                    >
                        {doctors.map((doctor) => (
                            <Option key={doctor.id} value={doctor.name}>
                                {doctor.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Preferred age format"
                    name="ageFormat"
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

                <Divider />

                <Form.Item label="Glycosilated HB" style={{ marginBottom: 0 }}>
                    <Form.Item
                        name="glycoHBValue"
                        rules={[{ required: true }]}
                        style={{ display: 'inline-block', width: '200px' }}
                    >
                        <Input addonAfter="%" placeholder="value" />
                    </Form.Item>
                    <div className="flex-row items-center inline-flex">
                        <Form.Item
                            name="glycoHBValueFlag"
                            style={{ display: 'inline-block', width: '150px', margin: '0 20px' }}
                        >
                            <Select placeholder="flag" mode="tags" maxCount={1}>
                                <Option value="Low">Low</Option>
                                <Option value="High">High</Option>
                            </Select>
                        </Form.Item>
                    </div>
                </Form.Item>
                <Form.Item label="Mean blood glucose" style={{ marginBottom: 0 }}>
                    <Form.Item
                        name="meanBloodGlucoseValue"
                        rules={[{ required: true }]}
                        style={{ display: 'inline-block', width: '200px' }}
                    >
                        <Input addonAfter="mg/dl" placeholder="value" />
                    </Form.Item>
                    <div className="flex-row items-center inline-flex">
                        <Form.Item
                            name="meanBloodGlucoseValueFlag"
                            style={{ display: 'inline-block', width: '150px', margin: '0 20px' }}
                        >
                            <Select placeholder="flag" mode="tags" maxCount={1}>
                                <Option value="Low">Low</Option>
                                <Option value="High">High</Option>
                            </Select>
                        </Form.Item>
                    </div>
                </Form.Item>

                <Form.Item
                    label="Comment"
                    name="comment"
                >
                    <Input.TextArea style={{ width: 375 }} />
                </Form.Item>
                <Form.Item label={null}>
                    <div className="flex justify-end mb-5">
                        <Button type="primary" htmlType="submit">
                            Save
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </div>
    )
}

export default GlycosilatedHBForm;