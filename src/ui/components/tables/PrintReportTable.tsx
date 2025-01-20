import React, { useEffect, useMemo, useState } from "react";
import {
    Button,
    DatePicker,
    Flex,
    InputNumber,
    message,
    Select,
    Spin,
    Switch,
    Table,
    Tag,
} from "antd";
import { debounce } from "lodash";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { formatISO } from "date-fns";
import { calculateAge } from "../../lib/utils";

interface TestRegistrationTableItems extends DataEmptyTests {
    key: string;
}

const PrintReportTable = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [mergeDisabled, setMergeDisabled] = useState<boolean>(true);
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState<TestRegistrationTableItems[]>([]);
    const [pagination, setPagination] = useState({ currentPage: 1, pageSize: 10, total: 0 });

    const [patients, setPatients] = useState<Patient[]>([]);
    const [filters, setFilters] = useState({
        patientId: undefined,
        refNumber: undefined,
        dateRange: { fromDate: undefined, toDate: undefined },
        allReports: false,
    });

    const columns = useMemo(() => [
        {
            title: "Date",
            dataIndex: "date",
            render: (value: any) => <p>{formatISO(value, { representation: "date" })}</p>,
        },
        {
            title: "Patient Name",
            dataIndex: "patientName",
            render: (value: any) => <p>{value}</p>,
        },
        {
            title: "Reference Number",
            dataIndex: "ref_number",
            render: (value: any) => (
                <p>
                    {value ? value : <Tag color="warning">Empty</Tag>}
                </p>
            ),
        },
        { title: "Test", dataIndex: "testName" },
        {
            title: "Action",
            render: (record: any) => (
                <div style={{ display: "flex", gap: "5px" }}>
                    <Button size="small" onClick={() => handlePrintReport(record.key)}>
                        Print
                    </Button>
                    <Button size="small" onClick={() => handlePrintPreview(record.key)}>
                        Preview
                    </Button>
                    <Button size="small" onClick={() => handleExportReports(record.key)}>
                        Export
                    </Button>
                </div>
            ),
        },
    ], [dataSource]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { currentPage, pageSize } = pagination;
            const { patientId, refNumber, dateRange, allReports } = filters;

            const data = await window.electron.report.getTests(
                currentPage,
                pageSize,
                allReports,
                dateRange.fromDate,
                dateRange.toDate,
                patientId,
                refNumber
            );

            setDataSource(data.registrations.map((item) => ({ ...item, key: `${item.testRegisterId},${item.testId}` })));
            setPagination((prev) => ({ ...prev, total: data.total }));
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPatients = debounce(async (search) => {
        try {
            setLoading(true);
            const data = await window.electron.patients.get(1, 5, search);
            setPatients(data.patients);
        } catch (error) {
            console.error("Failed to fetch patients:", error);
        } finally {
            setLoading(false);
        }
    }, 500);

    const updateFilter = (key: any, value: any) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    useEffect(() => {
        fetchData();
    }, [pagination.currentPage, pagination.pageSize, filters]);

    const handlePrintReport = (key: string | undefined) => {
        const selectedKeys = key ? [key] : selectedRowKeys;
        const selectedData = dataSource.filter((item) => selectedKeys.includes(item.key)) as DataEmptyTests[];
        messageApi.open({
            key: "message",
            type: "loading",
            content: "Printing..."
        });
        window.electron.report.print(selectedData);
    };

    const handlePrintPreview = (key: string) => {
        const selectedItem = dataSource.find((item) => item.key === key) as DataEmptyTests;
        
        if (selectedItem) {
            messageApi.open({
                key: "message",
                type: "loading",
                content: "Previewing..."
            });
            window.electron.report.printPreview(selectedItem);
        }
    };

    const handleMergeReports = () => {
        const selectedReports = dataSource.filter(item => selectedRowKeys.includes(item.key)) as DataEmptyTests[];
        messageApi.open({
            key: "login_message",
            type: "loading",
            content: "Merging..."
        });
        window.electron.report.mergeReports(selectedReports);
    }

    const handleExportReports = (key: string | undefined) => {
        const selectedKeys = key ? [key] : selectedRowKeys;
        const selectedData = dataSource.filter((item) => selectedKeys.includes(item.key)) as DataEmptyTests[];
        messageApi.open({
            key: "message",
            type: "loading",
            content: "Exporting..."
        });
        window.electron.report.export(selectedData);
    };

    useEffect(() => {
        if (selectedRowKeys.length < 2 || selectedRowKeys.length > 3) {
            setMergeDisabled(true);
        } else {
            const selectedRecords = dataSource.filter((item) => selectedRowKeys.includes(item.key));
            for (const element of selectedRecords) {
                if (selectedRecords[0].testRegisterId != element.testRegisterId) {
                    setMergeDisabled(true);
                    break;
                }
            }
            setMergeDisabled(false);
        }
    }, [selectedRowKeys]);

    return (
        <div className="p-5">
            {contextHolder}
            <div className="mb-5">
                <Flex justify="space-between">
                    <Flex gap={10} align="center">
                        <Select
                            showSearch
                            allowClear
                            placeholder="Select a patient"
                            onSearch={fetchPatients}
                            onSelect={(value) => updateFilter("patientId", value)}
                            onClear={() => updateFilter("patientId", undefined)}
                            notFoundContent={loading ? <Spin size="small" /> : "No patients found"}
                            filterOption={false}
                            style={{ width: 300 }}
                        >
                            {patients.map((patient) => (
                                <Select.Option key={patient.id} value={patient.id}>
                                    {patient.name} [{calculateAge(patient.date_of_birth, ["years"])}]
                                </Select.Option>
                            ))}
                        </Select>
                        <InputNumber
                            placeholder="Reference Number"
                            style={{ width: 150 }}
                            onChange={(value) => updateFilter("refNumber", value)}
                        />
                        <DatePicker.RangePicker
                            onChange={(_, dateStrings) => {
                                console.log(dateStrings);
                                updateFilter("dateRange", {
                                    fromDate: dateStrings[0] ? new Date(dateStrings[0]) : undefined,
                                    toDate: dateStrings[1] ? new Date(dateStrings[1]) : undefined,
                                })
                            }}
                            allowClear
                        />
                        <Switch
                            checked={filters.allReports}
                            onChange={(checked) => updateFilter("allReports", checked)}
                            checkedChildren={<CheckOutlined />}
                            unCheckedChildren={<CloseOutlined />}
                        />
                    </Flex>

                    <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                        <Button onClick={() => handlePrintReport(undefined)} disabled={!selectedRowKeys.length}>Print</Button>
                        <Button onClick={handleMergeReports} disabled={mergeDisabled}>Merge</Button>
                        <Button onClick={() => handleExportReports(undefined)} disabled={!selectedRowKeys.length}>Export</Button>
                    </div>
                </Flex>
            </div>
            <Table
                rowSelection={{
                    selectedRowKeys,
                    onChange: (keys) => setSelectedRowKeys(keys),
                }}
                columns={columns}
                dataSource={dataSource}
                loading={loading}
                pagination={{
                    current: pagination.currentPage,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    showSizeChanger: true,
                    onChange: (page, pageSize) => setPagination({ ...pagination, currentPage: page, pageSize }),
                }}
            />
        </div>
    );
};

export default PrintReportTable;
