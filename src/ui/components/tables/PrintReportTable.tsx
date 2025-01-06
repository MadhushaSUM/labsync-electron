import { Button, DatePicker, Flex, InputNumber, message, Select, Spin, Switch, Table, TableColumnsType, Tag } from "antd";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { calculateAge } from "../../lib/utils";
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { TableRowSelection } from "antd/es/table/interface";

interface TestRegistrationTableItems extends DataEmptyTests {
    key: string;
}

const PrintReportTable = () => {
    const [messageApi, contextHolder] = message.useMessage();

    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState<TestRegistrationTableItems[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);

    const [testRegistrations, setTestRegistrations] = useState<DataEmptyTests[]>([]);

    const [patients, setPatients] = useState<Patient[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
    const [selectedPatientId, setSelectedPatientId] = useState<number | undefined>(undefined);
    const [refNumber, setRefNumber] = useState<number | undefined>(undefined);
    const [dateRange, setDateRange] = useState<{ fromDate: Date | undefined, toDate: Date | undefined }>({ fromDate: undefined, toDate: undefined });
    const [allReports, setAllReports] = useState<boolean>(false);
    const [filterApplied, setFilterApplied] = useState<boolean>(false);

    const [mergeDisabled, setMergeDisabled] = useState<boolean>(true);

    const columns: TableColumnsType<TestRegistrationTableItems> = [
        {
            title: 'Date', dataIndex: 'date', key: 'date',
            render(value) {
                return (
                    <p>{value.toLocaleDateString()}</p>
                )
            },
        },
        {
            title: 'Patient Name', dataIndex: 'patientName', key: 'patientName',
            render(value) {
                return (
                    <p>{value}</p>
                )
            },
        },
        {
            title: 'Reference number', dataIndex: 'ref_number', key: 'refNumber',
            render(value) {
                return (
                    <p>{value ? value : <Tag bordered={false} color="warning">Empty</Tag>}</p>
                )
            }
        },
        { title: 'Test', dataIndex: 'testName', key: 'testName' },
        // { title: 'Reports collected', dataIndex: 'report_collected' },
        {
            title: 'Action',
            dataIndex: '',
            key: 'a',
            render: (record, _) => (
                <Button
                    size='small'
                    variant='outlined'
                    color='default'
                    onClick={() => handlePrintPreview(record.key)}
                >
                    Preview
                </Button>
            ),
        },
    ];

    const fetchTestsToPrint = async (page: number, pageSizeL: number, wantAll: boolean, patientId?: number, refNumber?: number, fromDate?: Date, toDate?: Date) => {
        const data = await window.electron.report.getTests(
            page,
            pageSizeL,
            wantAll,
            fromDate,
            toDate,
            patientId,
            refNumber
        );

        setTestRegistrations(data.registrations);
        setTotal(data.total);
    }

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

    const handlePatientClear = () => {
        setSelectedPatient(null);
        setSelectedPatientId(undefined);
    }

    const handleRefNumberChange = (value: any) => {
        setRefNumber(Number(value));
    }

    const handleDateRangeChange = (dateString: string[]) => {
        let fd = undefined;
        let td = undefined;
        if (dateString && dateString[0] != '') {
            fd = new Date(dateString[0])
        }
        if (dateString && dateString[1] != '') {
            td = new Date(dateString[1])
        }
        setDateRange({
            fromDate: fd,
            toDate: td,
        });
    }

    const handleIsAllReports = (value: any) => {
        if (value == "allReports") {
            setAllReports(true);
        } else {
            setAllReports(false);
        }
    }

    const handleApplyFilter = (isChecked: boolean) => {
        setCurrentPage(1);
        setFilterApplied(isChecked);
        if (isChecked) {
            fetchTestsToPrint(currentPage, pageSize, allReports, selectedPatientId, refNumber, dateRange.fromDate, dateRange.toDate);
        } else {
            setAllReports(false);
            fetchTestsToPrint(currentPage, pageSize, false);
        }
    }

    const handlePrintPreview = (key: string) => {
        const selectedRow = dataSource.find((item) => item.key == key);
        if (selectedRow) {
            window.electron.report.printPreview(selectedRow);
        }
    }

    const handleMergeReports = () => {
        const selectedReports = dataSource.filter((item) => selectedRowKeys.includes(item.key)) as DataEmptyTests[];
        window.electron.report.mergeReports(selectedReports);
    }

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection: TableRowSelection<TestRegistrationTableItems> = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const hasSelected = selectedRowKeys.length > 0;

    useEffect(() => {
        fetchTestsToPrint(currentPage, pageSize, allReports);
    }, [currentPage, pageSize]);

    useEffect(() => {
        setDataSource(testRegistrations.map((value) => ({ ...value, key: `${value.testRegisterId},${value.testId}` })));
    }, [testRegistrations]);

    useEffect(() => {
        const selectedRecords = dataSource.filter((item) => selectedRowKeys.includes(item.key));
        for (const element of selectedRecords) {
            if (selectedRecords.length > 1 && selectedRecords.length < 4) {
                if (selectedRecords[0].testRegisterId != element.testRegisterId) {
                    setMergeDisabled(true);
                    return;
                }
            } else {
                setMergeDisabled(true);
                return;
            }
        }
        setMergeDisabled(false);
    }, [selectedRowKeys]);

    return (
        <div className="p-5">
            {contextHolder}
            <div className="my-5">
                <Flex gap={5} justify="end">
                    <Button style={{ width: 100 }} color="primary" variant="solid">Print</Button>
                    <Button style={{ width: 100 }} color="primary" variant="outlined">Preview</Button>
                    <Button
                        style={{ width: 100 }}
                        color="default"
                        variant="outlined"
                        disabled={mergeDisabled}
                        onClick={handleMergeReports}
                    >
                        Merge
                    </Button>
                </Flex>
            </div>
            <div className="my-5">
                <Flex gap={5}>
                    <Select
                        showSearch
                        allowClear
                        placeholder="Select a patient"
                        onSearch={fetchPatients}
                        onSelect={handlePatientSelect}
                        onClear={handlePatientClear}
                        notFoundContent={loading ? <Spin size="small" /> : "No patients found"}
                        filterOption={false}
                        style={{ width: 300 }}
                        value={selectedPatient}
                    >
                        {patients.map((patient) => (
                            <Select.Option key={patient.id} value={`${patient.name} [${calculateAge(patient.date_of_birth)}]`}>
                                {patient.name} [{calculateAge(patient.date_of_birth)}]
                            </Select.Option>
                        ))}
                    </Select>

                    <InputNumber
                        controls={false}
                        placeholder="Enter a reference number"
                        style={{ width: 200 }}
                        onChange={(value) => handleRefNumberChange(value)}
                        onPressEnter={(e: any) => {
                            setPageSize(100);
                            setFilterApplied(true);
                            setAllReports(true);
                            fetchTestsToPrint(1, 100, true, undefined, Number(e.target.value), undefined, undefined);
                        }}
                    />

                    <DatePicker.RangePicker
                        placeholder={['Start date', 'End date']}
                        allowEmpty={[false, false]}
                        onChange={(_, dateString) => handleDateRangeChange(dateString)}
                    />

                    <Select
                        defaultValue="notPrinted"
                        style={{ width: 120 }}
                        onChange={(value) => handleIsAllReports(value)}
                        value={allReports ? "allReports" : "notPrinted"}
                        options={[
                            { value: 'notPrinted', label: 'Not Printed' },
                            { value: 'allReports', label: 'All Reports' },
                        ]}
                    />

                    <div className="ml-5 flex flex-row gap-2 items-center">

                        <p>Filter:</p>

                        <Switch
                            checkedChildren={<CheckOutlined />}
                            unCheckedChildren={<CloseOutlined />}
                            defaultValue={false}
                            onChange={(isChecked) => handleApplyFilter(isChecked)}
                            value={filterApplied}
                        />
                    </div>
                </Flex>
            </div>
            <div>
                <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={dataSource}
                    pagination={{
                        current: currentPage,
                        pageSize,
                        total,
                        showSizeChanger: true,
                        onChange(page, pageSize) {
                            setCurrentPage(page || 1);
                            setPageSize(pageSize || 10);
                        },
                    }}
                    footer={() => (
                        <span>
                            {hasSelected ? `Selected ${selectedRowKeys.length} items` : "Empty selection"}
                        </span>
                    )}
                />

            </div>
        </div>
    )
}

export default PrintReportTable;