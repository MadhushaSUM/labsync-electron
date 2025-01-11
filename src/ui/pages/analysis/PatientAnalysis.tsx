
import { useRef } from 'react';
import { Button, Card, DatePicker, Form, List, Select, Spin } from "antd"
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { calculateAge } from "../../lib/utils";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData } from "chart.js";
import { Doughnut, getElementAtEvent } from "react-chartjs-2";
import { ScrollArea } from '../../components/ScrollArea';

const { Option } = Select;

ChartJS.register(ArcElement, Tooltip, Legend);


const PatientAnalysis = () => {
    const chartRef = useRef<ChartJS<'doughnut'>>(null);
    const [form] = Form.useForm();

    const [loading, setLoading] = useState(false);

    const [patients, setPatients] = useState<Patient[]>([]);
    const [selectedPatientId, setSelectedPatientId] = useState<number | undefined>(undefined);

    const [data, setData] = useState<PatientAnalysisData>();
    const [chartData, setChartData] = useState<ChartData<'doughnut'>>();
    const [listData, setListData] = useState<{
        date: Date,
        refNumber?: number,
        testRegisterId: number
    }[]>([]);

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
        setSelectedPatientId(patients.find((patient) => `${patient.name} [${calculateAge(patient.date_of_birth)}]` === value)?.id);
    };

    const handleFormSubmit = async (values: any) => {
        setListData([]);
        setData(undefined);
        
        if (selectedPatientId) {
            if (values.dataRange) {
                const res = await window.electron.patientAnalysis.get(selectedPatientId, new Date(values.dateRange[0]), new Date(values.dateRange[1]));
                setData(res.data);
            } else {
                const res = await window.electron.patientAnalysis.get(selectedPatientId);
                setData(res.data);
            }
        }
    }

    const generateRandomColors = (length: number): string[] => {
        return Array.from({ length }, () => {
            const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
            return randomColor;
        });
    };


    const onClick = (event: any) => {
        const { current: chart } = chartRef;

        if (!chart) {
            return;
        }

        if (data) {
            setListData(data.pieChartData[getElementAtEvent(chart, event)[0].index].tests);
        }
    }

    useEffect(() => {
        if (data) {
            const chartData: ChartData<'doughnut'> = {
                datasets: [
                    {
                        data: data.pieChartData.map((item) => item.count),
                        backgroundColor: generateRandomColors(data.pieChartData.length),

                    }
                ],
                labels: data.pieChartData.map((item) => item.testName),
            }
            setChartData(chartData);
        }
    }, [data]);

    return (
        <div className="flex flex-col gap-5">
            <Card
                title="Patient Analysis"
            >
                <div>
                    <div>
                        <Form
                            layout="inline"
                            form={form}
                            initialValues={{}}
                            style={{ maxWidth: 'none' }}
                            onFinish={handleFormSubmit}
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
                                    style={{ width: 250 }}
                                >
                                    {patients.map((patient) => (
                                        <Option key={patient.id} value={`${patient.name} [${calculateAge(patient.date_of_birth)}]`}>
                                            {patient.name} [{calculateAge(patient.date_of_birth)}]
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item label="Date range" name="dateRange">
                                <DatePicker.RangePicker
                                    placeholder={['Start date', 'End date']}
                                    allowEmpty={[false, false]}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </Card>

            {data &&
                <Card>
                    <div className="flex flex-row gap-2 items-center justify-center">
                        <div style={{ width: "50%", height: "50%" }}>
                            {chartData && <Doughnut ref={chartRef} data={chartData} options={{ cutout: "80%" }} onClick={onClick} />}
                        </div>
                        <div>
                            <ScrollArea
                                className="ring-1 ring-gray-300 rounded-lg"
                            >
                                <List<{
                                    date: Date,
                                    refNumber?: number,
                                    testRegisterId: number
                                }>
                                    size="small"
                                    style={{ height: "calc(100vh - 400px)", width: "300px" }}
                                    dataSource={listData}
                                    renderItem={(item) => {
                                        return (
                                            <List.Item>
                                                <div className='flex flex-col gap-1 w-full'>
                                                    <p>{`Date: ${item.date.toLocaleDateString()}`}</p>
                                                    <p>{`Reference no.: ${item.refNumber}`}</p>
                                                    <Button color='primary' variant='filled' size='small'>View</Button>

                                                </div>
                                            </List.Item>
                                        )
                                    }}
                                />
                            </ScrollArea>
                        </div>
                    </div>
                </Card>
            }
        </div>
    )
}

export default PatientAnalysis;