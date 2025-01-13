import { Button, Divider, Form, Input, message, Select, Spin } from "antd";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { calculateAge } from "../../lib/utils";

const { Option } = Select;

const FBCForm = ({ data, clearScreen }: { data: DataEmptyTests, clearScreen: () => void }) => {
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
                wbcValue: Number(values.wbcValue),
                wbcValueFlag: values.wbcValueFlag,
                neutrophilsValue: Number(values.neutrophilsValue),
                neutrophilsValueFlag: values.neutrophilsValueFlag,
                lymphocytesValue: Number(values.lymphocytesValue),
                lymphocytesValueFlag: values.lymphocytesValueFlag,
                eosinophilsValue: Number(values.eosinophilsValue),
                eosinophilsValueFlag: values.eosinophilsValueFlag,
                monocytesValue: Number(values.monocytesValue),
                monocytesValueFlag: values.monocytesValueFlag,
                basophilsValue: Number(values.basophilsValue),
                basophilsValueFlag: values.basophilsValueFlag,
                heamoglobinValue: Number(values.heamoglobinValue),
                heamoglobinValueFlag: values.heamoglobinValueFlag,
                rbcValue: Number(values.rbcValue),
                rbcValueFlag: values.rbcValueFlag,
                htcpvcValue: Number(values.htcpvcValue),
                htcpvcValueFlag: values.htcpvcValueFlag,
                mcvValue: Number(values.mcvValue),
                mcvValueFlag: values.mcvValueFlag,
                mchValue: Number(values.mchValue),
                mchValueFlag: values.mchValueFlag,
                mchcValue: Number(values.mchcValue),
                mchcValueFlag: values.mchcValueFlag,
                plateletValue: Number(values.plateletValue),
                plateletValueFlag: values.plateletValueFlag,
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
                Full Blood Count
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
                        "wbcValue": data.data?.wbcValue,
                        "wbcValueFlag": data.data?.wbcValueFlag,
                        "neutrophilsValue": data.data?.neutrophilsValue,
                        "neutrophilsValueFlag": data.data?.neutrophilsValueFlag,
                        "lymphocytesValue": data.data?.lymphocytesValue,
                        "lymphocytesValueFlag": data.data?.lymphocytesValueFlag,
                        "eosinophilsValue": data.data?.eosinophilsValue,
                        "eosinophilsValueFlag": data.data?.eosinophilsValueFlag,
                        "monocytesValue": data.data?.monocytesValue,
                        "monocytesValueFlag": data.data?.monocytesValueFlag,
                        "basophilsValue": data.data?.basophilsValue,
                        "basophilsValueFlag": data.data?.basophilsValueFlag,
                        "heamoglobinValue": data.data?.heamoglobinValue,
                        "heamoglobinValueFlag": data.data?.heamoglobinValueFlag,
                        "rbcValue": data.data?.rbcValue,
                        "rbcValueFlag": data.data?.rbcValueFlag,
                        "htcpvcValue": data.data?.htcpvcValue,
                        "htcpvcValueFlag": data.data?.htcpvcValueFlag,
                        "mcvValue": data.data?.mcvValue,
                        "mcvValueFlag": data.data?.mcvValueFlag,
                        "mchValue": data.data?.mchValue,
                        "mchValueFlag": data.data?.mchValueFlag,
                        "mchcValue": data.data?.mchcValue,
                        "mchcValueFlag": data.data?.mchcValueFlag,
                        "plateletValue": data.data?.plateletValue,
                        "plateletValueFlag": data.data?.plateletValueFlag,
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

                <Form.Item label="Total WBC Count" style={{ marginBottom: 0 }}>
                    <Form.Item
                        name="wbcValue"
                        rules={[{ required: true }]}
                        style={{ display: 'inline-block', width: '200px' }}
                    >
                        <Input addonAfter="x10^(9) /L" placeholder="value" onChange={(e) => setFlag('wbcValue', e.target.value)} />
                    </Form.Item>
                    <div className="flex-row items-center inline-flex">
                        <Form.Item
                            name="wbcValueFlag"
                            style={{ display: 'inline-block', width: '150px', margin: '0 20px' }}
                        >
                            <Select placeholder="flag" mode="tags" maxCount={1}>
                                <Option value="Low">Low</Option>
                                <Option value="High">High</Option>
                            </Select>
                        </Form.Item>
                        <span>
                            {displayNormalRange('wbcValue')}
                        </span>
                    </div>
                </Form.Item>
                <Form.Item label="Neutrophils" style={{ marginBottom: 0 }}>
                    <Form.Item
                        name="neutrophilsValue"
                        rules={[{ required: true }]}
                        style={{ display: 'inline-block', width: '200px' }}
                    >
                        <Input addonAfter="%" placeholder="value" onChange={(e) => setFlag('neutrophilsValue', e.target.value)} />
                    </Form.Item>
                    <div className="flex-row items-center inline-flex">
                        <Form.Item
                            name="neutrophilsValueFlag"
                            style={{ display: 'inline-block', width: '150px', margin: '0 20px' }}
                        >
                            <Select placeholder="flag" mode="tags" maxCount={1}>
                                <Option value="Low">Low</Option>
                                <Option value="High">High</Option>
                            </Select>
                        </Form.Item>
                        <span>
                            {displayNormalRange('neutrophilsValue')}
                        </span>
                    </div>
                </Form.Item>
                <Form.Item label="Lymphocytes" style={{ marginBottom: 0 }}>
                    <Form.Item
                        name="lymphocytesValue"
                        rules={[{ required: true }]}
                        style={{ display: 'inline-block', width: '200px' }}
                    >
                        <Input addonAfter="%" placeholder="value" onChange={(e) => setFlag('lymphocytesValue', e.target.value)} />
                    </Form.Item>
                    <div className="flex-row items-center inline-flex">
                        <Form.Item
                            name="lymphocytesValueFlag"
                            style={{ display: 'inline-block', width: '150px', margin: '0 20px' }}
                        >
                            <Select placeholder="flag" mode="tags" maxCount={1}>
                                <Option value="Low">Low</Option>
                                <Option value="High">High</Option>
                            </Select>
                        </Form.Item>
                        <span>
                            {displayNormalRange('lymphocytesValue')}
                        </span>
                    </div>
                </Form.Item>
                <Form.Item label="Eosinophils" style={{ marginBottom: 0 }}>
                    <Form.Item
                        name="eosinophilsValue"
                        rules={[{ required: true }]}
                        style={{ display: 'inline-block', width: '200px' }}
                    >
                        <Input addonAfter="%" placeholder="value" onChange={(e) => setFlag('eosinophilsValue', e.target.value)} />
                    </Form.Item>
                    <div className="flex-row items-center inline-flex">
                        <Form.Item
                            name="eosinophilsValueFlag"
                            style={{ display: 'inline-block', width: '150px', margin: '0 20px' }}
                        >
                            <Select placeholder="flag" mode="tags" maxCount={1}>
                                <Option value="Low">Low</Option>
                                <Option value="High">High</Option>
                            </Select>
                        </Form.Item>
                        <span>
                            {displayNormalRange('eosinophilsValue')}
                        </span>
                    </div>
                </Form.Item>
                <Form.Item label="Monocytes" style={{ marginBottom: 0 }}>
                    <Form.Item
                        name="monocytesValue"
                        rules={[{ required: true }]}
                        style={{ display: 'inline-block', width: '200px' }}
                    >
                        <Input addonAfter="%" placeholder="value" onChange={(e) => setFlag('monocytesValue', e.target.value)} />
                    </Form.Item>
                    <div className="flex-row items-center inline-flex">
                        <Form.Item
                            name="monocytesValueFlag"
                            style={{ display: 'inline-block', width: '150px', margin: '0 20px' }}
                        >
                            <Select placeholder="flag" mode="tags" maxCount={1}>
                                <Option value="Low">Low</Option>
                                <Option value="High">High</Option>
                            </Select>
                        </Form.Item>
                        <span>
                            {displayNormalRange('monocytesValue')}
                        </span>
                    </div>
                </Form.Item>
                <Form.Item label="Basophils" style={{ marginBottom: 0 }}>
                    <Form.Item
                        name="basophilsValue"
                        rules={[{ required: true }]}
                        style={{ display: 'inline-block', width: '200px' }}
                    >
                        <Input addonAfter="%" placeholder="value" onChange={(e) => setFlag('basophilsValue', e.target.value)} />
                    </Form.Item>
                    <div className="flex-row items-center inline-flex">
                        <Form.Item
                            name="basophilsValueFlag"
                            style={{ display: 'inline-block', width: '150px', margin: '0 20px' }}
                        >
                            <Select placeholder="flag" mode="tags" maxCount={1}>
                                <Option value="Low">Low</Option>
                                <Option value="High">High</Option>
                            </Select>
                        </Form.Item>
                        <span>
                            {displayNormalRange('basophilsValue')}
                        </span>
                    </div>
                </Form.Item>
                <Form.Item label="Haemoglobin" style={{ marginBottom: 0 }}>
                    <Form.Item
                        name="heamoglobinValue"
                        rules={[{ required: true }]}
                        style={{ display: 'inline-block', width: '200px' }}
                    >
                        <Input addonAfter="g/dl" placeholder="value" onChange={(e) => setFlag('heamoglobinValue', e.target.value)} />
                    </Form.Item>
                    <div className="flex-row items-center inline-flex">
                        <Form.Item
                            name="heamoglobinValueFlag"
                            style={{ display: 'inline-block', width: '150px', margin: '0 20px' }}
                        >
                            <Select placeholder="flag" mode="tags" maxCount={1}>
                                <Option value="Low">Low</Option>
                                <Option value="High">High</Option>
                            </Select>
                        </Form.Item>
                        <span>
                            {displayNormalRange('heamoglobinValue')}
                        </span>
                    </div>
                </Form.Item>
                <Form.Item label="RBC Count" style={{ marginBottom: 0 }}>
                    <Form.Item
                        name="rbcValue"
                        rules={[{ required: true }]}
                        style={{ display: 'inline-block', width: '200px' }}
                    >
                        <Input addonAfter="x10^(12) /L" placeholder="value" onChange={(e) => setFlag('rbcValue', e.target.value)} />
                    </Form.Item>
                    <div className="flex-row items-center inline-flex">
                        <Form.Item
                            name="rbcValueFlag"
                            style={{ display: 'inline-block', width: '150px', margin: '0 20px' }}
                        >
                            <Select placeholder="flag" mode="tags" maxCount={1}>
                                <Option value="Low">Low</Option>
                                <Option value="High">High</Option>
                            </Select>
                        </Form.Item>
                        <span>
                            {displayNormalRange('rbcValue')}
                        </span>
                    </div>
                </Form.Item>
                <Form.Item label="HCT / PCV" style={{ marginBottom: 0 }}>
                    <Form.Item
                        name="htcpvcValue"
                        rules={[{ required: true }]}
                        style={{ display: 'inline-block', width: '200px' }}
                    >
                        <Input addonAfter="%" placeholder="value" onChange={(e) => setFlag('htcpvcValue', e.target.value)} />
                    </Form.Item>
                    <div className="flex-row items-center inline-flex">
                        <Form.Item
                            name="htcpvcValueFlag"
                            style={{ display: 'inline-block', width: '150px', margin: '0 20px' }}
                        >
                            <Select placeholder="flag" mode="tags" maxCount={1}>
                                <Option value="Low">Low</Option>
                                <Option value="High">High</Option>
                            </Select>
                        </Form.Item>
                        <span>
                            {displayNormalRange('htcpvcValue')}
                        </span>
                    </div>
                </Form.Item>
                <Form.Item label="MCV" style={{ marginBottom: 0 }}>
                    <Form.Item
                        name="mcvValue"
                        rules={[{ required: true }]}
                        style={{ display: 'inline-block', width: '200px' }}
                    >
                        <Input addonAfter="fl" placeholder="value" onChange={(e) => setFlag('mcvValue', e.target.value)} />
                    </Form.Item>
                    <div className="flex-row items-center inline-flex">
                        <Form.Item
                            name="mcvValueFlag"
                            style={{ display: 'inline-block', width: '150px', margin: '0 20px' }}
                        >
                            <Select placeholder="flag" mode="tags" maxCount={1}>
                                <Option value="Low">Low</Option>
                                <Option value="High">High</Option>
                            </Select>
                        </Form.Item>
                        <span>
                            {displayNormalRange('mcvValue')}
                        </span>
                    </div>
                </Form.Item>
                <Form.Item label="MCH" style={{ marginBottom: 0 }}>
                    <Form.Item
                        name="mchValue"
                        rules={[{ required: true }]}
                        style={{ display: 'inline-block', width: '200px' }}
                    >
                        <Input addonAfter="pg" placeholder="value" onChange={(e) => setFlag('mchValue', e.target.value)} />
                    </Form.Item>
                    <div className="flex-row items-center inline-flex">
                        <Form.Item
                            name="mchValueFlag"
                            style={{ display: 'inline-block', width: '150px', margin: '0 20px' }}
                        >
                            <Select placeholder="flag" mode="tags" maxCount={1}>
                                <Option value="Low">Low</Option>
                                <Option value="High">High</Option>
                            </Select>
                        </Form.Item>
                        <span>
                            {displayNormalRange('mchValue')}
                        </span>
                    </div>
                </Form.Item>
                <Form.Item label="MCHC" style={{ marginBottom: 0 }}>
                    <Form.Item
                        name="mchcValue"
                        rules={[{ required: true }]}
                        style={{ display: 'inline-block', width: '200px' }}
                    >
                        <Input addonAfter="g/dl" placeholder="value" onChange={(e) => setFlag('mchcValue', e.target.value)} />
                    </Form.Item>
                    <div className="flex-row items-center inline-flex">
                        <Form.Item
                            name="mchcValueFlag"
                            style={{ display: 'inline-block', width: '150px', margin: '0 20px' }}
                        >
                            <Select placeholder="flag" mode="tags" maxCount={1}>
                                <Option value="Low">Low</Option>
                                <Option value="High">High</Option>
                            </Select>
                        </Form.Item>
                        <span>
                            {displayNormalRange('mchcValue')}
                        </span>
                    </div>
                </Form.Item>
                <Form.Item label="Platelet count" style={{ marginBottom: 0 }}>
                    <Form.Item
                        name="plateletValue"
                        rules={[{ required: true }]}
                        style={{ display: 'inline-block', width: '200px' }}
                    >
                        <Input addonAfter="x10^(9) /L" placeholder="value" onChange={(e) => setFlag('plateletValue', e.target.value)} />
                    </Form.Item>
                    <div className="flex-row items-center inline-flex">
                        <Form.Item
                            name="plateletValueFlag"
                            style={{ display: 'inline-block', width: '150px', margin: '0 20px' }}
                        >
                            <Select placeholder="flag" mode="tags" maxCount={1}>
                                <Option value="Low">Low</Option>
                                <Option value="High">High</Option>
                            </Select>
                        </Form.Item>
                        <span>
                            {displayNormalRange('plateletValue')}
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

export default FBCForm;