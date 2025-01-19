import { Card, Descriptions, Typography, Tag } from "antd";

const { Title, Text } = Typography;

const ShowData = ({ data }: { data: { [key: string]: any } }) => {

    if (data) {
        return (
            <div className="flex flex-col gap-5">
                <Card>
                    <Title level={4}>Health Report</Title>
                    {data.comment && <Text type="secondary">{data.comment}</Text>}
                    <Descriptions bordered column={1} style={{ marginTop: "20px" }}>
                        {Object.entries(data).map(([key, value]) => {
                            if (key === "comment") return null;

                            return (
                                <Descriptions.Item label={key} key={key}>
                                    {key.endsWith("Flag") ? (
                                        <Tag color="blue">{value}</Tag>
                                    ) : typeof value === "object" && value !== null ? (
                                        <pre>{JSON.stringify(value, null, 2)}</pre>
                                    ) : (
                                        value
                                    )}
                                </Descriptions.Item>
                            );
                        })}
                    </Descriptions>
                </Card>
            </div>
        );
    } else {
        return (
            <div>
                <Card>
                    <Title level={5}>No Data</Title>
                </Card>
            </div>
        );
    }

};

export default ShowData;
