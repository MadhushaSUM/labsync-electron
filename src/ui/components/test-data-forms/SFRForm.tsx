import { Button, Divider, Form, Input, message, Select, Spin } from "antd";
import { debounce } from "lodash";
import { useEffect, useState } from "react";

const { Option } = Select;

const SFRForm = ({ data, clearScreen }: { data: DataEmptyTests, clearScreen: () => void }) => {
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
                colour: values.colour,
                appearance: values.appearance,
                reducingSubs: values.reducingSubs,
                aoc: values.aoc,
                redCells: values.redCells,
                pusCells: values.pusCells,
                epithelialCells: values.epithelialCells,
                fatGlobules: values.fatGlobules,
                mucus: values.mucus,
                vegFibrous: values.vegFibrous,
                yeast: values.yeast,
                comment: values.comment,

            }
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
                Stool Full Report
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
                        "colour": data.data ? data.data?.colour : "Greenish yellow",
                        "appearance": data.data ? data.data?.appearance : "Semi solid",
                        "reducingSubs": data.data ? data.data?.reducingSubs : "Nil",
                        "aoc": data.data ? data.data?.aoc : "Not detected",
                        "redCells": data.data ? data.data?.redCells : "Nil",
                        "pusCells": data.data ? data.data?.pusCells : "Nil",
                        "epithelialCells": data.data ? data.data?.epithelialCells : "Nil",
                        "fatGlobules": data.data ? data.data?.fatGlobules : "Nil",
                        "mucus": data.data ? data.data?.mucus : "Nil",
                        "vegFibrous": data.data ? data.data?.vegFibrous : "Nil",
                        "yeast": data.data ? data.data?.yeast : "Nil",
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

                <Form.Item
                    name="colour"
                    label="Colour"
                    rules={[{ required: true }]}
                >
                    <Select mode="tags" maxCount={1} style={{ width: 300 }}>
                        <Option value="Greenish yellow">Greenish yellow</Option>
                        <Option value="Pale yellow">Pale yellow</Option>
                        <Option value="Yellow">Yellow</Option>
                        <Option value="Pale brown">Pale brown</Option>
                        <Option value="Brown">Brown</Option>
                        <Option value="Pale black">Pale black</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="appearance"
                    label="Appearance"
                    rules={[{ required: true }]}
                >
                    <Select mode="tags" maxCount={1} style={{ width: 300 }} >
                        <Option value="Watery">Watery</Option>
                        <Option value="Semi solid">Semi solid</Option>
                        <Option value="Solid">Solid</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="reducingSubs"
                    label="Reducing substances"
                    rules={[{ required: true }]}
                >
                    <Select mode="tags" maxCount={1} style={{ width: 300 }}>
                        <Option value="Nil">Nil</Option>
                        <Option value="Green (0.5g%)">Green (0.5g%)</Option>
                        <Option value="Yellow (1g%)">Yellow (1g%)</Option>
                        <Option value="Orange (1.5g%)">Orange (1.5g%)</Option>
                        <Option value="Red brick (>2g%)">Red brick (&gt;2g%)</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="aoc"
                    label="AOC"
                    rules={[{ required: true }]}
                >
                    <Select mode="tags" maxCount={1} style={{ width: 300 }}>
                        <Option value="Not detected">Not detected</Option>
                        <Option value="Detected">Detected</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="redCells"
                    label="Red Cells"
                    rules={[{ required: true }]}
                >
                    <Select mode="tags" maxCount={1} style={{ width: 300 }}>
                        <Option value="Nil">Nil</Option>
                        <Option value="Occasional">Occasional</Option>
                        <Option value="1 - 3">1 - 3</Option>
                        <Option value="3 - 5">3 - 5</Option>
                        <Option value="Mod. field full">Mod. field full</Option>
                        <Option value="Field full">Field full</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="pusCells"
                    label="Pus Cells"
                    rules={[{ required: true }]}
                >
                    <Select mode="tags" maxCount={1} style={{ width: 300 }} >
                        <Option value="Nil">Nil</Option>
                        <Option value="Occasional">Occasional</Option>
                        <Option value="1 - 3">1 - 3</Option>
                        <Option value="3 - 5">3 - 5</Option>
                        <Option value="Mod. field full">Mod. field full</Option>
                        <Option value="Field full">Field full</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="epithelialCells"
                    label="Epithelial Cells"
                    rules={[{ required: true }]}
                >
                    <Select mode="tags" maxCount={1} style={{ width: 300 }}>
                        <Option value="Nil">Nil</Option>
                        <Option value="+">+</Option>
                        <Option value="++">++</Option>
                        <Option value="+++">+++</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="fatGlobules"
                    label="Fat Globules"
                    rules={[{ required: true }]}
                >
                    <Select mode="tags" maxCount={1} style={{ width: 300 }}>
                        <Option value="Nil">Nil</Option>
                        <Option value="+">+</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="mucus"
                    label="Mucus"
                    rules={[{ required: true }]}
                >
                    <Select mode="tags" maxCount={1} style={{ width: 300 }}>
                        <Option value="Nil">Nil</Option>
                        <Option value="+">+</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="vegFibrous"
                    label="Veg. Fibrous"
                    rules={[{ required: true }]}
                >
                    <Select mode="tags" maxCount={1} style={{ width: 300 }}>
                        <Option value="Nil">Nil</Option>
                        <Option value="+">+</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="yeast"
                    label="Yeast"
                    rules={[{ required: true }]}
                >
                    <Select mode="tags" maxCount={1} style={{ width: 300 }}>
                        <Option value="Nil">Nil</Option>
                        <Option value="+">+</Option>
                    </Select>
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

export default SFRForm;