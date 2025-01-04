import { Button, Divider, Form, Input, message, Select, Spin } from "antd";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { calculateAge } from "../../lib/utils";

const { Option } = Select;

const SElectrolyteForm = ({ data, clearScreen }: { data: DataEmptyTests, clearScreen: () => void }) => {
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
        const patientAge = calculateAge(data.patientDOB);

        if (fieldId) {
            const normalRangeRules: any = normalRanges.find((item) => item.test_field_id == fieldId)?.rules;
            if (normalRangeRules) {
                for (const rule of normalRangeRules) {
                    if (rule.ageUpper > patientAge && rule.ageLower <= patientAge && rule.gender.includes(data.patientGender)) {
                        if (valueNum > rule.valueUpper) {
                            form.setFieldValue(`${label}Flag`, 'High');
                        } else if (valueNum < rule.valueLower) {
                            form.setFieldValue(`${label}Flag`, 'Low');
                        } else {
                            form.setFieldValue(`${label}Flag`, null);
                        }
                        break;
                    }
                }
            }
        }
    }

    const displayNormalRange = (label: string) => {
        const fieldId = testFields.find((item) => item.name == label)?.id;
        const patientAge = calculateAge(data.patientDOB);

        if (fieldId) {
            const normalRangeRules: any = normalRanges.find((item) => item.test_field_id == fieldId)?.rules;
            if (normalRangeRules) {
                for (const rule of normalRangeRules) {
                    if (rule.ageUpper > patientAge && rule.ageLower <= patientAge && rule.gender.includes(data.patientGender)) {
                        return `High: ${rule.valueUpper}  Low: ${rule.valueLower}`
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
                sodiumValue: Number(values.sodiumValue),
                sodiumValueFlag: values.sodiumValueFlag,
                potassiumValue: Number(values.potassiumValue),
                potassiumValueFlag: values.potassiumValueFlag,
                comment: values.comment
            };
            const res = await window.electron.testRegister.addData(data.testRegisterId, data.testId, savingData, selectedDoctorId);
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
                Lipid Profile
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
                        "sodiumValue": data.data?.sodiumValue,
                        "sodiumValueFlag": data.data?.sodiumValueFlag,
                        "potassiumValue": data.data?.potassiumValue,
                        "potassiumValueFlag": data.data?.potassiumValueFlag,
                        "comment": data.data?.comment,
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

                <Divider />

                <Form.Item label="Sodium (Na⁺)" style={{ marginBottom: 0 }}>
                    <Form.Item
                        name="sodiumValue"
                        rules={[{ required: true }]}
                        style={{ display: 'inline-block', width: '200px' }}
                    >
                        <Input addonAfter="mEq/L" placeholder="value" onChange={(e) => setFlag('sodiumValue', e.target.value)} />
                    </Form.Item>
                    <div className="flex-row items-center inline-flex">
                        <Form.Item
                            name="sodiumValueFlag"
                            style={{ display: 'inline-block', width: '150px', margin: '0 20px' }}
                        >
                            <Select placeholder="flag" mode="tags" maxCount={1}>
                                <Option value="Low">Low</Option>
                                <Option value="High">High</Option>
                            </Select>
                        </Form.Item>
                        <span>
                            {displayNormalRange('sodiumValue')}
                        </span>
                    </div>
                </Form.Item>
                <Form.Item label="Potassium (K⁺)" style={{ marginBottom: 0 }}>
                    <Form.Item
                        name="potassiumValue"
                        rules={[{ required: true }]}
                        style={{ display: 'inline-block', width: '200px' }}
                    >
                        <Input addonAfter="mEq/L" placeholder="value" onChange={(e) => setFlag('potassiumValue', e.target.value)} />
                    </Form.Item>
                    <div className="flex-row items-center inline-flex">
                        <Form.Item
                            name="potassiumValueFlag"
                            style={{ display: 'inline-block', width: '150px', margin: '0 20px' }}
                        >
                            <Select placeholder="flag" mode="tags" maxCount={1}>
                                <Option value="Low">Low</Option>
                                <Option value="High">High</Option>
                            </Select>
                        </Form.Item>
                        <span>
                            {displayNormalRange('potassiumValue')}
                        </span>
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

export default SElectrolyteForm;