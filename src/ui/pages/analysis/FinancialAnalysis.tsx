import { Button, Card, DatePicker, Form, Select } from "antd";
import { useEffect, useRef, useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    ChartData,
    BarElement,
} from 'chart.js';
import { Bar, Doughnut, getElementAtEvent } from 'react-chartjs-2';
import { formatISO } from "date-fns";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const { Option } = Select;

const FinancialAnalysis = () => {
    const [form] = Form.useForm();
    const chartRef = useRef<ChartJS<"bar">>(null);

    const [loading, setLoading] = useState<boolean>(false);

    const [data, setData] = useState<FinancialAnalysisOutput>();
    const [lineData, setLineData] = useState<ChartData<"bar">>();
    const [chartData, setChartData] = useState<ChartData<'doughnut'>>();
    const [pieChartData, setPieChartData] = useState<{
        startDate: Date;
        endDate: Date;
        periodCost: number;
        periodPaid: number;
        tests: {
            testId: number;
            testName: string;
            testTotalCost: number;
        }[]
    }>();

    const handleFormSubmit = async (values: any) => {
        try {
            setLoading(true);
            setPieChartData(undefined);

            if (values.dateRange) {
                const res = await window.electron.financialAnalysis.get(
                    values.step,
                    new Date(values.dateRange[0]),
                    new Date(values.dateRange[1])
                );
                setData(res.data);
            } else {
                const res = await window.electron.financialAnalysis.get(values.step);
                setData(res.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const onClick = (event: any) => {
        const { current: chart } = chartRef;

        if (!chart) {
            return;
        }

        if (data) {
            setPieChartData(data.periods[getElementAtEvent(chart, event)[0].index]);
        }
    }

    const generateRandomColors = (length: number): string[] => {
        return Array.from({ length }, () => {
            const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
            return randomColor;
        });
    };

    useEffect(() => {
        if (data) {
            setLineData({
                labels: data.periods.map(item => formatISO(item.endDate, { representation: "date" })),
                datasets: [
                    {
                        label: "Total",
                        data: data.periods.map(item => item.periodCost),
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    },
                    {
                        label: "Paid",
                        data: data.periods.map(item => item.periodPaid),
                        borderColor: 'rgb(53, 162, 235)',
                        backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    }
                ],
            })
        }
    }, [data]);

    useEffect(() => {
        if (pieChartData) {
            setChartData({
                labels: pieChartData.tests.map(item => item.testName),
                datasets: [
                    {
                        data: pieChartData.tests.map(item => item.testTotalCost),
                        backgroundColor: generateRandomColors(pieChartData.tests.length),
                    }
                ]
            });
        }
    }, [pieChartData]);

    return (
        <div className="flex flex-col gap-5 pb-10">
            <Card
                title="Financial Analysis"
            >
                <div>
                    <Form
                        layout="inline"
                        form={form}
                        initialValues={{}}
                        style={{ maxWidth: 'none' }}
                        onFinish={handleFormSubmit}
                    >
                        <Form.Item label="Date range" name="dateRange">
                            <DatePicker.RangePicker
                                placeholder={['Start date', 'End date']}
                                allowEmpty={[false, false]}
                                disabled={loading}
                            />
                        </Form.Item>
                        <Form.Item
                            name="step"
                            label="Step"
                            rules={[{ required: true }]}
                        >
                            <Select style={{ width: 100 }} disabled={loading}>
                                <Option value="daily">Daily</Option>
                                <Option value="weekly">Weekly</Option>
                                <Option value="monthly">Monthly</Option>
                                <Option value="annually">Annually</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Search
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Card>

            {data && lineData &&
                <Card>
                    <div>
                        <Bar
                            ref={chartRef}
                            data={lineData}
                            onClick={onClick}
                            options={{
                                scales: {
                                    y: {
                                        title: {
                                            text: "Income (Rs.)",
                                            display: true,
                                        }
                                    },
                                    x: {
                                        title: {
                                            text: "Period end date",
                                            display: true,
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                </Card>
            }
            {pieChartData &&
                <Card>
                    <div className="flex justify-center items-center">
                        <div className="w-1/2">
                            {chartData && <Doughnut data={chartData} options={{
                                cutout: "80%", plugins: {
                                    legend: {
                                        position: 'bottom'
                                    }
                                }
                            }} />}
                        </div>
                    </div>
                </Card>
            }
        </div>
    )
}

export default FinancialAnalysis;