import { Button, Card, Checkbox, Col, DatePicker, Flex, Form, Input, InputNumber, message, Row, Select, Spin } from "antd";
import { useEffect, useState } from "react";
import { debounce } from 'lodash';
import dayjs from 'dayjs';
import { useNavigate } from "react-router-dom";
import { calculateAge } from "../../lib/utils";

const { Option } = Select;

const NewTest = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const [patients, setPatients] = useState<Patient[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
    const [selectedPatientId, setSelectedPatientId] = useState<number | undefined>(undefined);

    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
    const [selectedDoctorId, setSelectedDoctorId] = useState<number | undefined>(undefined);

    const [tests, setTests] = useState<Test[]>([]);

    const [loading, setLoading] = useState(false);

    const fetchPatients = debounce(async (search: string) => {
        try {
            setLoading(true);
            const data = await window.electron.patients.get(1, 5, search);
            setPatients(data.patients);
        } catch (error) {
            console.error("Failed to fetch patient data:", error);
        } finally {
            setLoading(false);
        }
    }, 500);

    const handlePatientSelect = (value: string) => {
        setSelectedPatient(value);
        setSelectedPatientId(patients.find((patient) => `${patient.name} [${calculateAge(patient.date_of_birth)}]` === value)?.id);
    };

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

    const fetchTests = async () => {
        try {
            setLoading(true);
            const data = await window.electron.tests.get(1, 10000, '');
            setTests(data.tests);
        } catch (error) {
            console.error("Failed to fetch doctor data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTests();
    }, []);

    const handleDoctorSelect = (value: string) => {
        setSelectedDoctor(value);
        setSelectedDoctorId(doctors.find((doctor) => doctor.name === value)?.id);
    };

    const onSelectedInvestigationsChange = (checkedValues: string[]) => {
        let total_cost = 0;
        for (const checkedValue of checkedValues) {
            const price = tests.find((test) => test.id == Number(checkedValue))?.price;
            total_cost += price ? price : 0;
        }

        form.setFieldValue("total_cost", total_cost);
    }

    const onFormSubmit = async (values: any) => {
        try {
            messageApi.open({
                key: "saving_message",
                type: "loading",
                content: "Adding registration..."
            });

            if (selectedPatientId) {
                const patientId = Number(selectedPatientId);
                const doctorId = selectedDoctorId ? selectedDoctorId : null;
                const refNumber = values.ref_number ? values.ref_number : null;

                let investigations = [];
                for (const investigationStr of values.investigations) {
                    investigations.push(Number(investigationStr));
                }

                const res = await window.electron.testRegister.insert(
                    patientId,
                    doctorId,
                    refNumber,
                    new Date(values.date),
                    investigations,
                    Number(values.total_cost),
                    Number(values.paid_price)
                )
                if (res.success) {
                    messageApi.open({
                        key: "saving_message",
                        type: "success",
                        content: "Registration added!"
                    });

                    form.resetFields();
                } else {
                    messageApi.open({
                        key: "saving_message",
                        type: "error",
                        content: "Failed to add registration!"
                    });
                    console.log(res.error);
                }
            } else {
                messageApi.open({
                    key: "saving_message",
                    type: "error",
                    content: "Failed to add registration!"
                });
            }
        } catch (error) {
            messageApi.open({
                key: "saving_message",
                type: "error",
                content: "Failed to add registration!"
            });
        }
    }

    return (
        <div>
            {contextHolder}
            <Card
                title="Register new test"
                className="h-full"
                actions={[
                    <Flex justify="end" gap="small">
                        <Button color="default" variant="solid" onClick={() => navigate("/test-registration")}>Go back</Button>
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
                        initialValues={{ date: dayjs() }}
                        form={form}
                    >
                        <Form.Item
                            label="Patient"
                            name="patient"
                            required
                            rules={[{ required: true, message: 'Please select a patient!' }]}
                        >
                            <Select
                                showSearch
                                allowClear
                                placeholder="Search for a patient"
                                onSearch={fetchPatients}
                                onSelect={handlePatientSelect}
                                notFoundContent={loading ? <Spin size="small" /> : "No patients found"}
                                filterOption={false}
                                style={{ width: "100%" }}
                                value={selectedPatient}
                            >
                                {patients.map((patient) => (
                                    <Option key={patient.id} value={`${patient.name} [${calculateAge(patient.date_of_birth)}]`}>
                                        {patient.name} [{calculateAge(patient.date_of_birth)}]
                                    </Option>
                                ))}
                            </Select>
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
                                notFoundContent={loading ? <Spin size="small" /> : "No doctors found"}
                                filterOption={false}
                                style={{ width: "100%" }}
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
                            label="Reference number"
                            name="ref_number"
                            rules={[{ type: "integer", message: "Only integers are accepted!" }]}
                        >
                            <InputNumber controls={false} />
                        </Form.Item>

                        <Form.Item
                            label="Date"
                            name="date"
                            required
                            rules={[{ required: true, message: 'Please select a date!' }]}
                        >
                            <DatePicker />
                        </Form.Item>

                        <Form.Item
                            label="Investigations"
                            name="investigations"
                            rules={[{ required: true, message: 'Please select at least one investigation!' }]}
                        >
                            <Checkbox.Group style={{ width: '100%' }} onChange={onSelectedInvestigationsChange}>
                                <Row>
                                    {tests.map((test, _) => (
                                        <Col key={test.id} span={12}>
                                            <Checkbox value={test.id}>{test.name}</Checkbox>
                                        </Col>
                                    ))}
                                </Row>
                            </Checkbox.Group>
                        </Form.Item>


                        <Form.Item
                            name="total_cost"
                            label="Total cost"
                        >
                            <Input readOnly style={{ width: 100 }} />
                        </Form.Item>

                        <Form.Item
                            name="paid_price"
                            label="Paid"
                        >
                            <InputNumber style={{ width: 100 }} />
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 6, span: 16 }} style={{ display: "flex", justifyContent: "end" }}>
                            <div className="flex flex-row gap-5">
                                <Button type="primary" htmlType="submit">
                                    Save & Print receipt
                                </Button>
                                <Button type="default" htmlType="submit">
                                    Save
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                </div>

            </Card>
        </div>
    );
};

export default NewTest;
