import { Alert, Card, Flex, Form, Progress, Select, Tooltip, Button, Divider, InputNumber, Row, Col, message } from "antd";
import { DefaultOptionType } from "antd/es/select";
import { useEffect, useState } from "react";
import { CloseOutlined } from '@ant-design/icons';

const NormalRanges = () => {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const [tests, setTests] = useState<DefaultOptionType[]>();
    const [testFields, setTestFields] = useState<DefaultOptionType[]>();
    const [fieldsLoading, setFieldsLoading] = useState(false);
    const [selectedTestId, setSelectedTestId] = useState<number | undefined>();
    const [selectedTestFieldId, setSelectedTestFieldId] = useState<number | undefined>();

    const [allTests, setAllTests] = useState<Test[]>();
    const [allTestFields, setAllTestFields] = useState<TestField[]>();

    const [coveredPercent, setCoveredPercent] = useState<{ male: number, female: number, other: number }>({ male: 0, female: 0, other: 0 });

    const getAllTests = async () => {
        const data = await window.electron.tests.get(1, 100000, '');
        setAllTests(data.tests);
        setTests(data.tests.map((test) => ({ value: test.id, label: test.name })));
    };

    const getFieldsOfTheTest = async () => {
        try {
            setFieldsLoading(true);
            if (selectedTestId) {
                const data = await window.electron.testFields.getForTest(selectedTestId);
                setAllTestFields(data.test_fields);
                setTestFields(data.test_fields.map((test_field) => ({ value: test_field.id, label: test_field.name })));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setFieldsLoading(false);
        }
    };

    const getRulesForTheField = async () => {
        try {
            setFieldsLoading(true);
            if (selectedTestFieldId) {
                const data = await window.electron.normalRanges.getForTestField(selectedTestFieldId);

                form.setFieldValue("rules", data.normalRanges[0].rules);
                calculateProgressPercent();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setFieldsLoading(false);
        }
    };

    const saveNormalRangeRules = async (e: any) => {
        try {
            messageApi.open({
                key: "updating_message",
                type: "loading",
                content: "Saving normal range rule..."
            });

            if (selectedTestId && selectedTestFieldId) {
                const res = await window.electron.normalRanges.insertOrUpdate(selectedTestId, selectedTestFieldId, e.rules);
                if (res.success) {
                    messageApi.open({
                        key: "updating_message",
                        type: "success",
                        content: "Normal range rule saved!"
                    });
                } else {
                    messageApi.open({
                        key: "updating_message",
                        type: "error",
                        content: "Error occured while saving Normal range rule!"
                    });
                    console.log(res.error);
                }
            }
        } catch (error) {
            console.log(error);

            messageApi.open({
                key: "updating_message",
                type: "error",
                content: "Error occured while saving Normal range rule!"
            });
        }
    }

    useEffect(() => {
        getAllTests();
    }, []);

    useEffect(() => {
        if (selectedTestId) {
            getFieldsOfTheTest();
            setSelectedTestFieldId(undefined);
        } else {
            setTestFields([]);
        }
    }, [selectedTestId]);

    useEffect(() => {
        if (selectedTestFieldId) {
            getRulesForTheField();
        }
    }, [selectedTestFieldId]);

    const onTestChange = (testId: string) => {
        form.resetFields();
        setCoveredPercent({ male: 0, female: 0, other: 0 });
        setSelectedTestId(Number(testId));
    };

    const onTestFieldChange = (fieldId: string) => {
        form.resetFields();
        setCoveredPercent({ male: 0, female: 0, other: 0 });
        setSelectedTestFieldId(Number(fieldId));
    };

    const calculateProgressPercent = () => {
        const rules = form.getFieldValue("rules");
        let malePercent = 0;
        let femalePercent = 0;
        let otherPercent = 0;
        if (rules) {
            for (const rule of rules) {
                if (rule.gender.includes("Male")) {
                    malePercent += (rule.ageUpper - rule.ageLower);
                }
                if (rule.gender.includes("Female")) {
                    femalePercent += (rule.ageUpper - rule.ageLower);
                }
                if (rule.gender.includes("Other")) {
                    otherPercent += (rule.ageUpper - rule.ageLower);
                }
            }
        }
        setCoveredPercent({ male: malePercent, female: femalePercent, other: otherPercent });
    }

    return (
        <div className="flex flex-col gap-5">
            {contextHolder}
            <Card title="Welcome to the Settings: Normal Ranges Page">
                <div>
                    <Flex vertical gap="small">
                        <Flex gap="small">
                            <Select
                                showSearch
                                placeholder="Select a test"
                                optionFilterProp="label"
                                onChange={onTestChange}
                                options={tests}
                                style={{ width: 300 }}
                            />
                            <Select
                                showSearch
                                placeholder="Select a field"
                                optionFilterProp="label"
                                onChange={onTestFieldChange}
                                options={testFields}
                                disabled={fieldsLoading || !selectedTestId}
                                style={{ width: 300 }}
                                value={allTestFields?.find((field) => field.id == selectedTestFieldId)?.name}
                            />
                        </Flex>
                    </Flex>
                </div>
            </Card>
            {selectedTestId && selectedTestFieldId && (
                <Card>
                    <Row gutter={[15, 5]} align="middle">
                        <Col span={8}>
                            <div>
                                <Alert
                                    message="Informational Notes"
                                    description={`Test: ${allTests?.find((test) => test.id == selectedTestId)?.name} Field: ${allTestFields?.find((field) => field.id == selectedTestFieldId)?.name}`}
                                    type="success"
                                    showIcon
                                />
                            </div>
                        </Col>
                        <Col span={16}>
                            <div>
                                <div>
                                    <p>Male coverage:</p>
                                    <Tooltip title="Covered male age range out of 120 years">
                                        <Progress
                                            percent={coveredPercent.male / 1.2}
                                            status="active"
                                            strokeColor={{ from: '#00F260', to: '#0575E6' }}
                                            format={() => `${coveredPercent.male} years out of 120`}
                                        />
                                    </Tooltip>
                                </div>
                                <div>
                                    <p>Female coverage:</p>
                                    <Tooltip title="Covered female age range out of 120 years">
                                        <Progress
                                            percent={coveredPercent.female / 1.2}
                                            status="active"
                                            strokeColor={{ from: '#f953c6', to: '#b91d73' }}
                                            format={() => `${coveredPercent.female} years out of 120`}
                                        />
                                    </Tooltip>
                                </div>
                                <div>
                                    <p>Other coverage:</p>
                                    <Tooltip title="Covered other age range out of 120 years">
                                        <Progress
                                            percent={coveredPercent.other / 1.2}
                                            status="active"
                                            strokeColor={{ from: '#3494E6', to: '#EC6EAD' }}
                                            format={() => `${coveredPercent.other} years out of 120`}
                                        />
                                    </Tooltip>
                                </div>
                            </div>
                        </Col>
                    </Row>

                    <Divider />

                    <Row gutter={[5, 5]}>
                        <Col
                            md={{ flex: "100%" }}
                            lg={{ flex: "50%" }}
                        >
                            <Alert message="Note: For age ranges, only the lower bound is inclusive." type="info" showIcon />
                        </Col>
                        <Col
                            md={{ flex: "100%" }}
                            lg={{ flex: "50%" }}
                        >
                            <Alert message="Note: For value ranges, both lower and upper bounds are inclusive." type="info" showIcon />
                        </Col>
                    </Row>

                    <Divider />

                    <div className="mt-5 flex flex-col justify-center items-center content-center">
                        <Form
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 18 }}
                            form={form}
                            style={{ maxWidth: 600 }}
                            autoComplete="off"
                            onValuesChange={calculateProgressPercent}
                            onFinish={saveNormalRangeRules}
                        >
                            <div>
                                <Form.List name="rules">
                                    {(fields, { add, remove }) => (
                                        <div className="flex flex-col gap-5" >
                                            {fields.map((field) => (
                                                <Card
                                                    size="small"
                                                    title={`Rule ${field.name + 1}`}
                                                    key={field.key}
                                                    extra={
                                                        <CloseOutlined
                                                            onClick={() => {
                                                                remove(field.name);
                                                            }}
                                                        />
                                                    }
                                                >
                                                    <Form.Item label="Gender" name={[field.name, 'gender']}>
                                                        <Select
                                                            mode="multiple"
                                                            allowClear
                                                        >
                                                            <Select.Option value="Male">Male</Select.Option>
                                                            <Select.Option value="Female">Female</Select.Option>
                                                            <Select.Option value="Other">Other</Select.Option>
                                                        </Select>
                                                    </Form.Item>
                                                    <Row>
                                                        <Col
                                                            span={12}
                                                        >
                                                            <Form.Item label="Age lower bound" labelCol={{ span: 12 }} name={[field.name, 'ageLower']}>
                                                                <InputNumber />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col
                                                            span={12}
                                                        >
                                                            <Form.Item label="Age upper bound" labelCol={{ span: 12 }} name={[field.name, 'ageUpper']}>
                                                                <InputNumber />
                                                            </Form.Item>
                                                        </Col>

                                                        <Col
                                                            span={12}
                                                        >
                                                            <Form.Item label="Value lower bound" labelCol={{ span: 12 }} name={[field.name, 'valueLower']}>
                                                                <InputNumber />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col
                                                            span={12}
                                                        >
                                                            <Form.Item label="Value upper bound" labelCol={{ span: 12 }} name={[field.name, 'valueUpper']}>
                                                                <InputNumber />
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                </Card>
                                            ))}

                                            <Button type="dashed" onClick={() => add()} block>
                                                + Add Normal Range Rule
                                            </Button>
                                        </div>
                                    )}
                                </Form.List>
                            </div>

                            <div className="mt-5">
                                <Flex align="end" justify="end">
                                    <Button
                                        variant="solid"
                                        color="primary"
                                        htmlType="submit"
                                    >
                                        Save
                                    </Button>
                                </Flex>
                            </div>
                        </Form>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default NormalRanges;
