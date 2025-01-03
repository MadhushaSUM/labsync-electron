import { Button, Divider, Form, Input, message, Select, Spin } from "antd";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { calculateAge } from "../../lib/utils";

const { Option } = Select;

const LipidProfileForm = ({ data, clearScreen }: { data: DataEmptyTests, clearScreen: () => void }) => {
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
                totalCholesterolValue: Number(values.totalCholesterolValue),
                totalCholesterolValueFlag: values.totalCholesterolValueFlag,
                triglyceridsValue: Number(values.triglyceridsValue),
                triglyceridsValueFlag: values.triglyceridsValueFlag,
                hdlCholesterolValue: Number(values.hdlCholesterolValue),
                hdlCholesterolValueFlag: values.hdlCholesterolValueFlag,
                ldlCholesterolValue: Number(values.ldlCholesterolValue),
                ldlCholesterolValueFlag: values.ldlCholesterolValueFlag,
                vldlCholesterolValue: Number(values.vldlCholesterolValue),
                vldlCholesterolValueFlag: values.vldlCholesterolValueFlag,
                tchoHdlRValue: Number(values.tchoHdlRValue),
                tchoHdlRValueFlag: values.tchoHdlRValueFlag,
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
                        "totalCholesterolValue": data.data?.totalCholesterolValue,
                        "totalCholesterolValueFlag": data.data?.totalCholesterolValueFlag,
                        "triglyceridsValue": data.data?.triglyceridsValue,
                        "triglyceridsValueFlag": data.data?.triglyceridsValueFlag,
                        "hdlCholesterolValue": data.data?.hdlCholesterolValue,
                        "hdlCholesterolValueFlag": data.data?.hdlCholesterolValueFlag,
                        "ldlCholesterolValue": data.data?.ldlCholesterolValue,
                        "ldlCholesterolValueFlag": data.data?.ldlCholesterolValueFlag,
                        "vldlCholesterolValue": data.data?.vldlCholesterolValue,
                        "vldlCholesterolValueFlag": data.data?.vldlCholesterolValueFlag,
                        "tchoHdlRValue": data.data?.tchoHdlRValue,
                        "tchoHdlRValueFlag": data.data?.tchoHdlRValueFlag,
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

                <Form.Item label="Total Cholesterol" style={{ marginBottom: 0 }}>
                    <Form.Item
                        name="totalCholesterolValue"
                        rules={[{ required: true }]}
                        style={{ display: 'inline-block', width: '200px' }}
                    >
                        <Input addonAfter="mg/dl" placeholder="value" onChange={(e) => setFlag('totalCholesterolValue', e.target.value)} />
                    </Form.Item>
                    <div className="flex-row items-center inline-flex">
                        <Form.Item
                            name="totalCholesterolValueFlag"
                            style={{ display: 'inline-block', width: '150px', margin: '0 20px' }}
                        >
                            <Select placeholder="flag" mode="tags" maxCount={1}>
                                <Option value="Low">Low</Option>
                                <Option value="High">High</Option>
                            </Select>
                        </Form.Item>
                        <span>
                            {displayNormalRange('totalCholesterolValue')}
                        </span>
                    </div>
                </Form.Item>
                <Form.Item label="Triglycerids" style={{ marginBottom: 0 }}>
                    <Form.Item
                        name="triglyceridsValue"
                        rules={[{ required: true }]}
                        style={{ display: 'inline-block', width: '200px' }}
                    >
                        <Input addonAfter="mg/dl" placeholder="value" onChange={(e) => setFlag('triglyceridsValue', e.target.value)} />
                    </Form.Item>
                    <div className="flex-row items-center inline-flex">
                        <Form.Item
                            name="triglyceridsValueFlag"
                            style={{ display: 'inline-block', width: '150px', margin: '0 20px' }}
                        >
                            <Select placeholder="flag" mode="tags" maxCount={1}>
                                <Option value="Low">Low</Option>
                                <Option value="High">High</Option>
                            </Select>
                        </Form.Item>
                        <span>
                            {displayNormalRange('triglyceridsValue')}
                        </span>
                    </div>
                </Form.Item>
                <Form.Item label="HDL Cholesterol" style={{ marginBottom: 0 }}>
                    <Form.Item
                        name="hdlCholesterolValue"
                        rules={[{ required: true }]}
                        style={{ display: 'inline-block', width: '200px' }}
                    >
                        <Input addonAfter="mg/dl" placeholder="value" onChange={(e) => setFlag('hdlCholesterolValue', e.target.value)} />
                    </Form.Item>
                    <div className="flex-row items-center inline-flex">
                        <Form.Item
                            name="hdlCholesterolValueFlag"
                            style={{ display: 'inline-block', width: '150px', margin: '0 20px' }}
                        >
                            <Select placeholder="flag" mode="tags" maxCount={1}>
                                <Option value="Low">Low</Option>
                                <Option value="High">High</Option>
                            </Select>
                        </Form.Item>
                        <span>
                            {displayNormalRange('hdlCholesterolValue')}
                        </span>
                    </div>
                </Form.Item>
                <Form.Item label="LDL Cholesterol" style={{ marginBottom: 0 }}>
                    <Form.Item
                        name="ldlCholesterolValue"
                        rules={[{ required: true }]}
                        style={{ display: 'inline-block', width: '200px' }}
                    >
                        <Input addonAfter="mg/dl" placeholder="value" onChange={(e) => setFlag('ldlCholesterolValue', e.target.value)} />
                    </Form.Item>
                    <div className="flex-row items-center inline-flex">
                        <Form.Item
                            name="ldlCholesterolValueFlag"
                            style={{ display: 'inline-block', width: '150px', margin: '0 20px' }}
                        >
                            <Select placeholder="flag" mode="tags" maxCount={1}>
                                <Option value="Low">Low</Option>
                                <Option value="High">High</Option>
                            </Select>
                        </Form.Item>
                        <span>
                            {displayNormalRange('ldlCholesterolValue')}
                        </span>
                    </div>
                </Form.Item>
                <Form.Item label="VLDL Cholesterol" style={{ marginBottom: 0 }}>
                    <Form.Item
                        name="vldlCholesterolValue"
                        rules={[{ required: true }]}
                        style={{ display: 'inline-block', width: '200px' }}
                    >
                        <Input addonAfter="mg/dl" placeholder="value" onChange={(e) => setFlag('vldlCholesterolValue', e.target.value)} />
                    </Form.Item>
                    <div className="flex-row items-center inline-flex">
                        <Form.Item
                            name="vldlCholesterolValueFlag"
                            style={{ display: 'inline-block', width: '150px', margin: '0 20px' }}
                        >
                            <Select placeholder="flag" mode="tags" maxCount={1}>
                                <Option value="Low">Low</Option>
                                <Option value="High">High</Option>
                            </Select>
                        </Form.Item>
                        <span>
                            {displayNormalRange('vldlCholesterolValue')}
                        </span>
                    </div>
                </Form.Item>
                <Form.Item label="Total Chol. / HDL" style={{ marginBottom: 0 }}>
                    <Form.Item
                        name="tchoHdlRValue"
                        rules={[{ required: true }]}
                        style={{ display: 'inline-block', width: '200px' }}
                    >
                        <Input placeholder="value" onChange={(e) => setFlag('tchoHdlRValue', e.target.value)} />
                    </Form.Item>
                    <div className="flex-row items-center inline-flex">
                        <Form.Item
                            name="tchoHdlRValueFlag"
                            style={{ display: 'inline-block', width: '150px', margin: '0 20px' }}
                        >
                            <Select placeholder="flag" mode="tags" maxCount={1}>
                                <Option value="Low">Low</Option>
                                <Option value="High">High</Option>
                            </Select>
                        </Form.Item>
                        <span>
                            {displayNormalRange('tchoHdlRValue')}
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

export default LipidProfileForm;