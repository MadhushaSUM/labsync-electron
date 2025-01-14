import { Button, DatePicker, Flex, InputNumber, message, Modal, Select, Spin, Switch, Table, TableColumnsType, Tag } from "antd";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { calculateAge } from "../../lib/utils";
import { CheckOutlined, CloseOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { TableRowSelection } from "antd/es/table/interface";

const { confirm } = Modal;

interface TestRegistrationTableItems extends Registration {
}

const TestRegistrationTable = (
    {
        editTestFunctionHandle,
    }: {
        editTestFunctionHandle: (id: number) => void,
    }
) => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState<TestRegistrationTableItems[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);

    const [testRegistrations, setTestRegistrations] = useState<Registration[]>([]);

    const [patients, setPatients] = useState<Patient[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
    const [selectedPatientId, setSelectedPatientId] = useState<number | undefined>(undefined);
    const [refNumber, setRefNumber] = useState<number | undefined>(undefined);
    const [dateRange, setDateRange] = useState<{ fromDate: Date | undefined, toDate: Date | undefined }>({ fromDate: undefined, toDate: undefined });
    const [filterApplied, setFilterApplied] = useState<boolean>(false);

    const columns: TableColumnsType<TestRegistrationTableItems> = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        {
            title: 'Patient Name', dataIndex: 'patient', key: 'patientName',
            render(value) {
                return (
                    <p>{value.name}</p>
                )
            },
        },
        {
            title: 'Date', dataIndex: 'date', key: 'date',
            render(value) {
                return (
                    <p>{value.toLocaleDateString()}</p>
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
        { title: 'Total cost', dataIndex: 'total_cost', key: 'totalCost' },
        { title: 'Paid price', dataIndex: 'paid_price', key: 'paidPrice' },
        // { title: 'Reports collected', dataIndex: 'report_collected' },
        {
            title: 'Action',
            dataIndex: '',
            key: 'a',
            render: (_, record) => (
                <Flex gap={5}>
                    <Button
                        size='small'
                        variant='outlined'
                        color='primary'
                        onClick={() => onPrintReceiptClick(record)}
                    >
                        Print receipt
                    </Button>
                    <Button
                        size='small'
                        variant='outlined'
                        color='default'
                        onClick={() => onTableRowEditClick(record)}
                    >
                        Edit
                    </Button>
                </Flex>
            ),
        },
    ];

    const expandColumns: TableColumnsType = [
        {
            title: 'Test', dataIndex: 'test', key: 'testName',
            render(value) {
                return (
                    <p>{value.name}</p>
                )
            },
            width: 150,
        },
        {
            title: 'Requested doctor', dataIndex: 'doctor', key: 'doctorName',
            render(value) {
                return (
                    <p>{value ? value.name : <Tag bordered={false} color="warning">Empty</Tag>}</p>
                )
            },
            width: 300,
        },
        {
            title: 'Data', dataIndex: 'data', key: 'data',
            render(value) {
                return (
                    <p>{value ? <Button size="small" color="primary" variant="outlined">View</Button> : <Tag bordered={false} color="warning">Empty</Tag>}</p>
                )
            }
        },
        {
            title: 'Data added', dataIndex: 'data_added', key: 'dataAdded',
            render(value) {
                return (
                    <Tag bordered={false} color={value ? "success" : "processing"}>
                        {value ? "Yes" : "No"}
                    </Tag>
                )
            },
            width: 150,
        },
        {
            title: 'Printed', dataIndex: 'printed', key: 'printed',
            render(value) {
                return (
                    <Tag bordered={false} color={value ? "success" : "processing"}>
                        {value ? "Yes" : "No"}
                    </Tag>
                )
            },
            width: 150,
        },
        {
            title: 'Action',
            dataIndex: '',
            key: 'a',
            render: (_, record) => (
                <Button
                    size='small'
                    variant='outlined'
                    color='primary'
                    onClick={async () => {
                        try {
                            const res = await window.electron.testRegister.editDataOfATest(
                                Number(record.testRegisterId),
                                Number(record.test.id)
                            );
                            if (res.success) {
                                setCurrentPage(1);
                                if (filterApplied) {
                                    fetchTestRegistrations(1, pageSize, selectedPatientId, refNumber, dateRange.fromDate, dateRange.toDate);
                                } else {
                                    fetchTestRegistrations(1, pageSize);
                                }
                            }

                        } catch (error) {
                            console.error(error);
                        }
                    }}
                >
                    Edit
                </Button>

            ),
        },
    ]

    const onPrintReceiptClick = (record: TestRegistrationTableItems) => {
        try {
            window.electron.report.printReceipt(record as Registration);
        } catch (error) {
            console.error(error);
        }
    }

    const onTableRowEditClick = (record: TestRegistrationTableItems) => {
        editTestFunctionHandle(Number(record.id));
        navigate("/edit-test-registration");
    }

    const fetchTestRegistrations = async (page: number, pageSizeL: number, patientId?: number, refNumber?: number, fromDate?: Date, toDate?: Date) => {
        const data = await window.electron.testRegister.get(
            page,
            pageSizeL,
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

    const handleApplyFilter = (isChecked: boolean) => {
        setCurrentPage(1);
        setFilterApplied(isChecked);
        if (isChecked) {
            fetchTestRegistrations(1, pageSize, selectedPatientId, refNumber, dateRange.fromDate, dateRange.toDate);
        } else {
            fetchTestRegistrations(1, pageSize);
        }
    }

    const expandedRowRender = (record: any) => (
        <Table
            columns={expandColumns}
            dataSource={
                testRegistrations
                    .find((value) => value.id == record.id)?.registeredTests
                    .map((item) => ({ ...item, testRegisterId: record.id }))
            }
            pagination={false}
            size="small"
        />
    );

    const deleteTestRegisters = async () => {
        const deletingIds = selectedRowKeys.map((item) => Number(item));

        const isAdmin = await window.electron.authenticate.isAdmin();
        if (!isAdmin) {
            messageApi.open({
                key: "login_message",
                type: "warning",
                content: "Admin user privileges required!"
            });
            return;
        }
        confirm({
            title: 'Do you want to delete these records?',
            icon: <ExclamationCircleFilled />,
            content: 'This action is irreversible. Do you want to proceed?',
            onOk() {
                return window.electron.testRegister
                    .delete(deletingIds)
                    .then(() => {
                        setSelectedRowKeys([]);
                        fetchTestRegistrations(currentPage, pageSize, selectedPatientId, refNumber, dateRange.fromDate, dateRange.toDate);
                    })
                    .catch((error) => {
                        console.error('Error deleting records:', error);
                    });
            },
            onCancel() { },
        });
    };


    useEffect(() => {
        fetchTestRegistrations(currentPage, pageSize);
    }, [currentPage, pageSize]);

    useEffect(() => {
        setDataSource(testRegistrations.map((value) => ({ ...value, key: value.id })));
    }, [testRegistrations]);

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection: TableRowSelection<TestRegistrationTableItems> = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    return (
        <div className="p-5">
            {contextHolder}
            <div>
                <Flex justify="end" gap={5}>
                    <Button variant="solid" color="primary" onClick={() => navigate("/new-test")}>New Test Registration</Button>
                    <Button variant="outlined" color="danger" onClick={deleteTestRegisters}>Delete</Button>
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
                            setFilterApplied(true);
                            fetchTestRegistrations(1, 1, undefined, Number(e.target.value), undefined, undefined);
                        }}
                    />

                    <DatePicker.RangePicker
                        placeholder={['Start date', 'End date']}
                        allowEmpty={[false, false]}
                        onChange={(_, dateString) => handleDateRangeChange(dateString)}
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
                    expandable={{ expandedRowRender, defaultExpandedRowKeys: ['0'] }}
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
                />
            </div>
        </div>
    )
}

export default TestRegistrationTable;