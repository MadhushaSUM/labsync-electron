import { Button, Divider, Form, Input, message, Select, Spin } from "antd";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { isWithinNormalRange } from "../../lib/utils";

const { Option } = Select;

const RBSForm = ({ data, clearScreen }: { data: DataEmptyTests, clearScreen: () => void }) => {
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();

    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
    const [selectedDoctorId, setSelectedDoctorId] = useState<number | undefined>(undefined);

    const [normalRanges, setNormalRanges] = useState<NormalRange[]>([]);
    const [testFields, setTestFields] = useState<TestField[]>([]);

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

    const fetchNormalRanges = async () => {
        const res = await window.electron.normalRanges.getForTest(data.testId);
        setNormalRanges(res.normalRanges);
    }

    const fetchTestFields = async () => {
        const res = await window.electron.testFields.getForTest(data.testId);
        setTestFields(res.test_fields);
    }

    const handleDoctorSelect = (value: string) => {
        setSelectedDoctor(value);
        setSelectedDoctorId(doctors.find((doctor) => doctor.name === value)?.id);
    };
    const handleDoctorClear = () => {
        setSelectedDoctor(null);
        setSelectedDoctorId(undefined);
    }

    const setFlag = (label: string, value: string) => {
            const valueNum = Number(value);
            const fieldId = testFields.find((item) => item.name == label)?.id;
    
            if (fieldId) {
                const normalRangeRules: any = normalRanges.find((item) => item.test_field_id == fieldId)?.rules;
                if (normalRangeRules) {
                    for (const rule of normalRangeRules) {
                        if (isWithinNormalRange(data.patientDOB, data.patientGender, rule))
                            if (rule.type == "range") {
                                if (valueNum > rule.valueUpper) {
                                    form.setFieldValue(`${label}Flag`, 'High');
                                } else if (valueNum < rule.valueLower) {
                                    form.setFieldValue(`${label}Flag`, 'Low');
                                } else {
                                    form.setFieldValue(`${label}Flag`, null);
                                }
                            } else if (rule.type == "≥") {
                                if (valueNum < rule.valueLower) {
                                    form.setFieldValue(`${label}Flag`, 'Low');
                                } else {
                                    form.setFieldValue(`${label}Flag`, null);
                                }
                            } else {
                                if (valueNum > rule.valueUpper) {
                                    form.setFieldValue(`${label}Flag`, 'High');
                                } else {
                                    form.setFieldValue(`${label}Flag`, null);
                                }
                            }
                        break;
                    }
                }
            }
        }
    
        const displayNormalRange = (label: string) => {
            const fieldId = testFields.find((item) => item.name == label)?.id;
            if (fieldId) {
                const normalRangeRules: any = normalRanges.find((item) => item.test_field_id == fieldId)?.rules;
                if (normalRangeRules) {
                    for (const rule of normalRangeRules) {
                        if (isWithinNormalRange(data.patientDOB, data.patientGender, rule)) {
                            if (rule.type == "range") {
                                return `${rule.valueLower} - ${rule.valueUpper}`;
                            } else if (rule.type == "≥") {
                                return `≥ ${rule.valueLower}`;
                            } else {
                                return `≤ ${rule.valueUpper}`;
                            }
                        }
                    }
                }
            }
        }

    useEffect(() => {
        if (data.doctorId) {
            setSelectedDoctorId(Number(data.doctorId));
        }
        fetchNormalRanges();
        fetchTestFields();
    }, [data]);

    const onFinish = async (values: any) => {
        try {
            messageApi.open({
                key: "saving_message",
                type: "loading",
                content: "Saving test data..."
            });
            const savingData = {
                rbsValue: Number(values.rbsValue),
                rbsValueFlag: values.rbsValueFlag,
                time: values.time,
                comment: values.comment
            }
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
                Random Blood Sugar
            </p>
            <Form
                name="complex-form"
                onFinish={onFinish}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 16 }}
                form={form}
                initialValues={
                    {
                        "patient": data.patientName,
                        "doctor": data.doctorName,
                        "rbsValue": data.data?.rbsValue,
                        "rbsValueFlag": data.data?.rbsValueFlag,
                        "time": data.data?.time,
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

                <Form.Item label="RBS value" style={{ marginBottom: 0 }}>
                    <Form.Item
                        name="rbsValue"
                        rules={[{ required: true }]}
                        style={{ display: 'inline-block', width: '200px' }}
                    >
                        <Input addonAfter="mg/dl" placeholder="value" onChange={(e) => setFlag('rbsValue', e.target.value)} />
                    </Form.Item>
                    <div className="flex-row items-center inline-flex">
                        <Form.Item
                            name="rbsValueFlag"
                            style={{ display: 'inline-block', width: '150px', margin: '0 20px' }}
                        >
                            <Select placeholder="flag" mode="tags" maxCount={1}>
                                <Option value="Low">Low</Option>
                                <Option value="High">High</Option>
                            </Select>
                        </Form.Item>
                        <span>
                            {displayNormalRange('rbsValue')}
                        </span>
                    </div>
                </Form.Item>
                <Form.Item
                    name="time"
                    label="Time"
                    rules={[{ required: true }]}
                >
                    <Input style={{ width: 200 }} />
                </Form.Item>
                <Form.Item
                    label="Comment"
                    name="comment"
                >
                    <Input.TextArea style={{ width: 375 }} />
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

export default RBSForm;