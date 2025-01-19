import { Button, Card, Checkbox, Col, DatePicker, Flex, Form, Input, InputNumber, message, Modal, Row, Select, Space, Spin } from "antd";
import { useEffect, useState } from "react";
import { debounce } from 'lodash';
import dayjs from 'dayjs';
import { useNavigate } from "react-router-dom";
import { calculateAge, calculateDateOfBirth } from "../../lib/utils";

const { Option } = Select;

interface AddPatientFormType extends Patient {
}

const NewTest = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [newPatientForm] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const [open, setOpen] = useState(false);

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
        await saveRegistration(values);
    }

    const handleSaveAndPrintReceipt = async () => {
        const values = form.getFieldsValue();
        const testRegisterId = await saveRegistration(values);
        if (testRegisterId) {
            const { registration } = await window.electron.testRegister.getById(testRegisterId);
            if (registration) {
                window.electron.report.printReceipt(registration);
            }
        }
    }


    const saveRegistration = async (values: any) => {
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
                    return res.testRegisterId;
                } else {
                    messageApi.open({
                        key: "saving_message",
                        type: "error",
                        content: "Failed to add registration!"
                    });
                    console.log(res.error);
                    return undefined;
                }
            } else {
                messageApi.open({
                    key: "saving_message",
                    type: "error",
                    content: "Failed to add registration!"
                });
                return undefined;
            }
        } catch (error) {
            messageApi.open({
                key: "saving_message",
                type: "error",
                content: "Failed to add registration!"
            });
            return undefined;
        }
    }

    const onAddNewPatient = async (formData: AddPatientFormType) => {
        let newPatient: Omit<Patient, "id"> = {
            name: formData.name,
            gender: formData.gender,
            date_of_birth: new Date(formData.date_of_birth),
        }
        if (formData.contact_number !== undefined || "") {
            newPatient.contact_number = formData.contact_number
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

        setOpen(false);
    };

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
            newPatientForm.setFieldValue("date_of_birth", dayjs(dateOfBirth));
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
                            <div className="flex flex-row gap-5 w-[500px]">
                                <Select
                                    showSearch
                                    allowClear
                                    placeholder="Search for a patient"
                                    onSearch={fetchPatients}
                                    onSelect={handlePatientSelect}
                                    notFoundContent={loading ? <Spin size="small" /> : "No patients found"}
                                    filterOption={false}
                                    style={{ width: 300 }}
                                    value={selectedPatient}
                                >
                                    {patients.map((patient) => (
                                        <Option key={patient.id} value={`${patient.name} [${calculateAge(patient.date_of_birth)}]`}>
                                            {patient.name} [{calculateAge(patient.date_of_birth)}]
                                        </Option>
                                    ))}
                                </Select>

                                <Button
                                    color="default"
                                    variant="filled"
                                    onClick={() => {
                                        setOpen(true);
                                    }}
                                >
                                    New patient
                                </Button>
                            </div>
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
                                <Button type="primary" onClick={handleSaveAndPrintReceipt}>
                                    Save & Print receipt
                                </Button>
                                <Button type="default" htmlType="submit">
                                    Save
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                </div>

                <div>
                    <Modal
                        open={open}
                        title="Add new patient"
                        okText="Add"
                        cancelText="Cancel"
                        okButtonProps={{ autoFocus: true, htmlType: 'submit' }}
                        onCancel={() => setOpen(false)}
                        destroyOnClose
                        modalRender={(dom) => (
                            <Form
                                layout="vertical"
                                form={newPatientForm}
                                name="form_in_modal"
                                clearOnDestroy
                                onFinish={(values) => onAddNewPatient(values)}
                            >
                                {dom}
                            </Form>
                        )}
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
                            name="contact_number"
                            label="Contact number"
                            hasFeedback
                            validateDebounce={500}
                            rules={[{ len: 12, message: 'Please enter a valid contact number!' }]}
                        >
                            <Input placeholder="+94..." />
                        </Form.Item>
                    </Modal>
                </div>

            </Card>
        </div>
    );
};

export default NewTest;
