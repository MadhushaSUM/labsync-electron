import { Card, Col, List, message, Row } from "antd";
import React, { useEffect, useState } from "react";
import { ScrollArea } from "../../components/ScrollArea";
import formMapper from "../../components/test-data-forms/FormMapper";

const Home = () => {
    const [registrations, setRegistrations] = useState<DataEmptyTests[]>([]);
    const [selectedTest, setSelectedTest] = useState<DataEmptyTests | null>(null);
    const [messageApi, contextHolder] = message.useMessage();


    const clearSelectedTest = () => {
        setSelectedTest(null);
        messageApi.open({
            key: "saving_message",
            type: "success",
            content: "Data saved!"
        });
    }

    const fetchDataEmptyTests = async () => {
        const data = await window.electron.testRegister.getDataEmptyTests();
        setRegistrations(data.dataEmptyTests);
    }

    const handleListItemClick = (item: DataEmptyTests) => {
        setSelectedTest(item);
    }

    useEffect(() => {
        fetchDataEmptyTests();
    }, []);

    return (
        <div className="h-full">
            {contextHolder}
            <Card
                title="Add Investigation Data"
                className="h-full"
            >
                <Row gutter={[10, 10]}>
                    <Col span={6}>
                        <ScrollArea
                            className="ring-1 ring-gray-300 rounded-lg"
                        >
                            <div>
                                <List<DataEmptyTests>
                                    size="small"
                                    style={{ height: "calc(100vh - 220px)" }}
                                    dataSource={registrations}
                                    renderItem={(item) => {
                                        return (
                                            <List.Item
                                                onClick={() => handleListItemClick(item)}
                                            >
                                                <p className="cursor-pointer">{`${item.patientName} ${item.date.toLocaleDateString()} ${item.ref_number}`}</p>
                                            </List.Item>
                                        )
                                    }}
                                />
                            </div>
                        </ScrollArea>
                    </Col>

                    <Col span={18}>
                        <ScrollArea>
                            <div
                                style={{ height: "calc(100vh - 220px)" }}
                                className="bg-zinc-200/60 rounded-lg flex justify-center w-full p-5"
                            >
                                {selectedTest ? (
                                    formMapper[selectedTest.testId] ? (
                                        React.createElement(formMapper[selectedTest.testId], { data: selectedTest, clearScreen: clearSelectedTest })
                                    ) : (
                                        <p>Form not found</p>
                                    )
                                ) : (
                                    <p>Please select an item</p>
                                )}
                            </div>
                        </ScrollArea>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default Home;
