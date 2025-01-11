import { Button, Card, DatePicker, Form, List } from "antd";
import { useEffect, useRef, useState } from "react";
import { Doughnut, getElementAtEvent } from "react-chartjs-2";
import { ScrollArea } from "../../components/ScrollArea";
import { Chart as ChartJS, ChartData } from "chart.js";

const TestAnalysis = () => {
    const [form] = Form.useForm();
    const chartRef = useRef<ChartJS<'doughnut'>>(null);

    const [data, setData] = useState<AnalysisData>();
    const [chartData, setChartData] = useState<ChartData<'doughnut'>>();
    const [listData, setListData] = useState<{
        date: Date,
        refNumber?: number,
        testRegisterId: number
    }[]>([]);

    const handleFormSubmit = async (values: any) => {
        if (values.dateRange) {
            const res = await window.electron.testAnalysis.get(new Date(values.dateRange[0]), new Date(values.dateRange[1]));
            setData(res.data);
        } else {
            const res = await window.electron.testAnalysis.get();
            setData(res.data);
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
                title="Test Analysis"
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

export default TestAnalysis;