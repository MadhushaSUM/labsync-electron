import { Button, Divider, Form, Input, message, Select, Spin } from "antd";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { calculateAge } from "../../lib/utils";

const { Option } = Select;

const LFTForm = ({ data, clearScreen }: { data: DataEmptyTests, clearScreen: () => void }) => {
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
                sgotValue: Number(values.sgotValue),
                sgotValueFlag: values.sgotValueFlag,
                sgptValue: Number(values.sgptValue),
                sgptValueFlag: values.sgptValueFlag,
                sAlkalinePhosValue: Number(values.sAlkalinePhosValue),
                sAlkalinePhosValueFlag: values.sAlkalinePhosValueFlag,
                totalBilirubinValue: Number(values.totalBilirubinValue),
                totalBilirubinValueFlag: values.totalBilirubinValueFlag,
                directBilirubinValue: Number(values.directBilirubinValue),
                directBilirubinValueFlag: values.directBilirubinValueFlag,
                indirectBilirubinValue: Number(values.indirectBilirubinValue),
                indirectBilirubinValueFlag: values.indirectBilirubinValueFlag,
                totalProteinsValue: Number(values.totalProteinsValue),
                totalProteinsValueFlag: values.totalProteinsValueFlag,
                albuminValue: Number(values.albuminValue),
                albuminValueFlag: values.albuminValueFlag,
                globulinValue: Number(values.globulinValue),
                globulinValueFlag: values.globulinValueFlag,
                agRatioValue: Number(values.agRatioValue),
                gammaGtValue: Number(values.gammaGtValue),
                gammaGtValueFlag: values.gammaGtValueFlag,
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
                Liver profile / Liver function tests
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
                        "sgotValue": data.data?.sgotValue,
                        "sgotValueFlag": data.data?.sgotValueFlag,
                        "sgptValue": data.data?.sgptValue,
                        "sgptValueFlag": data.data?.sgptValueFlag,
                        "sAlkalinePhosValue": data.data?.sAlkalinePhosValue,
                        "sAlkalinePhosValueFlag": data.data?.sAlkalinePhosValueFlag,
                        "totalBilirubinValue": data.data?.totalBilirubinValue,
                        "totalBilirubinValueFlag": data.data?.totalBilirubinValueFlag,
                        "directBilirubinValue": data.data?.directBilirubinValue,
                        "directBilirubinValueFlag": data.data?.directBilirubinValueFlag,
                        "indirectBilirubinValue": data.data?.indirectBilirubinValue,
                        "indirectBilirubinValueFlag": data.data?.indirectBilirubinValueFlag,
                        "totalProteinsValue": data.data?.totalProteinsValue,
                        "totalProteinsValueFlag": data.data?.totalProteinsValueFlag,
                        "albuminValue": data.data?.albuminValue,
                        "albuminValueFlag": data.data?.albuminValueFlag,
                        "globulinValue": data.data?.globulinValue,
                        "globulinValueFlag": data.data?.globulinValueFlag,
                        "agRatioValue": data.data?.agRatioValue,
                        "gammaGtValue": data.data?.gammaGtValue,
                        "gammaGtValueFlag": data.data?.gammaGtValueFlag,
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

                <Form.Item label="AST / SGOT" style={{ marginBottom: 0 }}>
                    <Form.Item
                        name="sgotValue"
                        rules={[{ required: true }]}
                        style={{ display: 'inline-block', width: '200px' }}
                    >
                        <Input addonAfter="U/L" placeholder="value" onChange={(e) => setFlag('sgotValue', e.target.value)} />
                    </Form.Item>
                    <div className="flex-row items-center inline-flex">
                        <Form.Item
                            name="sgotValueFlag"
                            style={{ display: 'inline-block', width: '150px', margin: '0 20px' }}
                        >
                            <Select placeholder="flag" mode="tags" maxCount={1}>
                                <Option value="Low">Low</Option>
                                <Option value="High">High</Option>
                            </Select>
                        </Form.Item>
                        <span>
                            {displayNormalRange('sgotValue')}
                        </span>
                    </div>
                </Form.Item>
                <Form.Item label="ALT / SGPT" style={{ marginBottom: 0 }}>
                    <Form.Item
                        name="sgptValue"
                        rules={[{ required: true }]}
                        style={{ display: 'inline-block', width: '200px' }}
                    >
                        <Input addonAfter="U/L" placeholder="value" onChange={(e) => setFlag('sgptValue', e.target.value)} />
                    </Form.Item>
                    <div className="flex-row items-center inline-flex">
                        <Form.Item
                            name="sgptValueFlag"
                            style={{ display: 'inline-block', width: '150px', margin: '0 20px' }}
                        >
                            <Select placeholder="flag" mode="tags" maxCount={1}>
                                <Option value="Low">Low</Option>
                                <Option value="High">High</Option>
                            </Select>
                        </Form.Item>
                        <span>
                            {displayNormalRange('sgptValue')}
                        </span>
                    </div>
                </Form.Item>
                <Form.Item label="S. Alkaline Phosphatase" style={{ marginBottom: 0 }}>
                    <Form.Item
                        name="sAlkalinePhosValue"
                        rules={[{ required: true }]}
                        style={{ display: 'inline-block', width: '200px' }}
                    >
                        <Input addonAfter="U/L" placeholder="value" onChange={(e) => setFlag('sAlkalinePhosValue', e.target.value)} />
                    </Form.Item>
                    <div className="flex-row items-center inline-flex">
                        <Form.Item
                            name="sAlkalinePhosValueFlag"
                            style={{ display: 'inline-block', width: '150px', margin: '0 20px' }}
                        >
                            <Select placeholder="flag" mode="tags" maxCount={1}>
                                <Option value="Low">Low</Option>
                                <Option value="High">High</Option>
                            </Select>
                        </Form.Item>
                        <span>
                            {displayNormalRange('sAlkalinePhosValue')}
                        </span>
                    </div>
                </Form.Item>
                <Form.Item label="Total Bilirubin" style={{ marginBottom: 0 }}>
                    <Form.Item
                        name="totalBilirubinValue"
                        rules={[{ required: true }]}
                        style={{ display: 'inline-block', width: '200px' }}
                    >
                        <Input addonAfter="mg/dl" placeholder="value" onChange={(e) => setFlag('totalBilirubinValue', e.target.value)} />
                    </Form.Item>
                    <div className="flex-row items-center inline-flex">
                        <Form.Item
                            name="totalBilirubinValueFlag"
                            style={{ display: 'inline-block', width: '150px', margin: '0 20px' }}
                        >
                            <Select placeholder="flag" mode="tags" maxCount={1}>
                                <Option value="Low">Low</Option>
                                <Option value="High">High</Option>
                            </Select>
                        </Form.Item>
                        <span>
                            {displayNormalRange('totalBilirubinValue')}
                        </span>
                    </div>
                </Form.Item>
                <Form.Item label="Direct Bilirubin" style={{ marginBottom: 0 }}>
                    <Form.Item
                        name="directBilirubinValue"
                        rules={[{ required: true }]}
                        style={{ display: 'inline-block', width: '200px' }}
                    >
                        <Input addonAfter="mg/dl" placeholder="value" onChange={(e) => setFlag('directBilirubinValue', e.target.value)} />
                    </Form.Item>
                    <div className="flex-row items-center inline-flex">
                        <Form.Item
                            name="directBilirubinValueFlag"
                            style={{ display: 'inline-block', width: '150px', margin: '0 20px' }}
                        >
                            <Select placeholder="flag" mode="tags" maxCount={1}>
                                <Option value="Low">Low</Option>
                                <Option value="High">High</Option>
                            </Select>
                        </Form.Item>
                        <span>
                            {displayNormalRange('directBilirubinValue')}
                        </span>
                    </div>
                </Form.Item>
                <Form.Item label="Indirect Bilirubin" style={{ marginBottom: 0 }}>
                    <Form.Item
                        name="indirectBilirubinValue"
                        rules={[{ required: true }]}
                        style={{ display: 'inline-block', width: '200px' }}
                    >
                        <Input addonAfter="mg/dl" placeholder="value" onChange={(e) => setFlag('indirectBilirubinValue', e.target.value)} />
                    </Form.Item>
                    <div className="flex-row items-center inline-flex">
                        <Form.Item
                            name="indirectBilirubinValueFlag"
                            style={{ display: 'inline-block', width: '150px', margin: '0 20px' }}
                        >
                            <Select placeholder="flag" mode="tags" maxCount={1}>
                                <Option value="Low">Low</Option>
                                <Option value="High">High</Option>
                            </Select>
                        </Form.Item>
                        <span>
                            {displayNormalRange('indirectBilirubinValue')}
                        </span>
                    </div>
                </Form.Item>
                <Form.Item label="Total Proteins" style={{ marginBottom: 0 }}>
                    <Form.Item
                        name="totalProteinsValue"
                        rules={[{ required: true }]}
                        style={{ display: 'inline-block', width: '200px' }}
                    >
                        <Input addonAfter="g/dl" placeholder="value" onChange={(e) => setFlag('totalProteinsValue', e.target.value)} />
                    </Form.Item>
                    <div className="flex-row items-center inline-flex">
                        <Form.Item
                            name="totalProteinsValueFlag"
                            style={{ display: 'inline-block', width: '150px', margin: '0 20px' }}
                        >
                            <Select placeholder="flag" mode="tags" maxCount={1}>
                                <Option value="Low">Low</Option>
                                <Option value="High">High</Option>
                            </Select>
                        </Form.Item>
                        <span>
                            {displayNormalRange('totalProteinsValue')}
                        </span>
                    </div>
                </Form.Item>
                <Form.Item label="Albumin" style={{ marginBottom: 0 }}>
                    <Form.Item
                        name="albuminValue"
                        rules={[{ required: true }]}
                        style={{ display: 'inline-block', width: '200px' }}
                    >
                        <Input addonAfter="g/dl" placeholder="value" onChange={(e) => setFlag('albuminValue', e.target.value)} />
                    </Form.Item>
                    <div className="flex-row items-center inline-flex">
                        <Form.Item
                            name="albuminValueFlag"
                            style={{ display: 'inline-block', width: '150px', margin: '0 20px' }}
                        >
                            <Select placeholder="flag" mode="tags" maxCount={1}>
                                <Option value="Low">Low</Option>
                                <Option value="High">High</Option>
                            </Select>
                        </Form.Item>
                        <span>
                            {displayNormalRange('albuminValue')}
                        </span>
                    </div>
                </Form.Item>
                <Form.Item label="Globulin" style={{ marginBottom: 0 }}>
                    <Form.Item
                        name="globulinValue"
                        rules={[{ required: true }]}
                        style={{ display: 'inline-block', width: '200px' }}
                    >
                        <Input addonAfter="g/dl" placeholder="value" onChange={(e) => setFlag('globulinValue', e.target.value)} />
                    </Form.Item>
                    <div className="flex-row items-center inline-flex">
                        <Form.Item
                            name="globulinValueFlag"
                            style={{ display: 'inline-block', width: '150px', margin: '0 20px' }}
                        >
                            <Select placeholder="flag" mode="tags" maxCount={1}>
                                <Option value="Low">Low</Option>
                                <Option value="High">High</Option>
                            </Select>
                        </Form.Item>
                        <span>
                            {displayNormalRange('globulinValue')}
                        </span>
                    </div>
                </Form.Item>
                <Form.Item
                    label="Albumin/Globulin ratio"
                    name="agRatioValue"
                    rules={[{ required: true }]}
                >
                    <Input placeholder="value" style={{width: 370}}/>
                </Form.Item>
                <Form.Item label="GAMMA GT" style={{ marginBottom: 0 }}>
                    <Form.Item
                        name="gammaGtValue"
                        rules={[{ required: true }]}
                        style={{ display: 'inline-block', width: '200px' }}
                    >
                        <Input addonAfter="U/L" placeholder="value" onChange={(e) => setFlag('gammaGtValue', e.target.value)} />
                    </Form.Item>
                    <div className="flex-row items-center inline-flex">
                        <Form.Item
                            name="gammaGtValueFlag"
                            style={{ display: 'inline-block', width: '150px', margin: '0 20px' }}
                        >
                            <Select placeholder="flag" mode="tags" maxCount={1}>
                                <Option value="Low">Low</Option>
                                <Option value="High">High</Option>
                            </Select>
                        </Form.Item>
                        <span>
                            {displayNormalRange('gammaGtValue')}
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

export default LFTForm;