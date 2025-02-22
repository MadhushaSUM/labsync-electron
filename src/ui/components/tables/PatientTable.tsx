import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Button, DatePicker, Flex, Form, Input, message, Modal, Select, Table } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import Search from 'antd/es/input/Search';
import moment from 'moment';
import { formatISO } from 'date-fns';
import { ExclamationCircleFilled } from '@ant-design/icons';

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

type PatientTableItems = Omit<Patient, "date_of_birth"> & {
    key: number;
    date_of_birth: string;
}

const { confirm } = Modal;

const PatientsTable = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState<PatientTableItems[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);


    const [form] = Form.useForm();
    const [editFormValues, setEditFormValues] = useState<Patient>();
    const [open, setOpen] = useState(false);


    const onTableRowEditClick = (record: PatientTableItems) => {
        const patient: Patient = {
            id: record.id,
            name: record.name,
            gender: record.gender,
            contact_number: record.contact_number,
            date_of_birth: new Date(record.date_of_birth)
        }
        setEditFormValues(patient);
        setOpen(true);
    }

    const columns: TableColumnsType<PatientTableItems> = [
        { title: 'ID', dataIndex: 'id' },
        { title: 'Name', dataIndex: 'name' },
        { title: 'Gender', dataIndex: 'gender' },
        { title: 'Date of birth', dataIndex: 'date_of_birth' },
        { title: 'Contact number', dataIndex: 'contact_number' },
        {
            title: 'Action',
            dataIndex: '',
            key: 'a',
            render: (_, record) => (
                <Button
                    size='small'
                    variant='outlined'
                    color='default'
                    onClick={() => onTableRowEditClick(record)}
                >
                    Edit
                </Button>
            ),
        },
    ];

    const onEditSubmit = async (values: Patient) => {
        try {
            messageApi.open({
                key: "updating_message",
                type: "loading",
                content: "Updating patient..."
            });

            const d = values.date_of_birth as unknown as moment.Moment;

            const updatingPatient: Patient = {
                id: values.id,
                name: values.name,
                gender: values.gender,
                contact_number: values.contact_number,
                date_of_birth: new Date(d.toString())
            }

            const res = await window.electron.patients.update(values.id, updatingPatient);

            if (res.success) {
                messageApi.open({
                    key: "updating_message",
                    type: "success",
                    content: "Patient updated!",
                    duration: 2
                });
            } else {
                messageApi.open({
                    key: "updating_message",
                    type: "error",
                    content: "Error occurred while updating the patient!",
                    duration: 3
                });
            }

            setOpen(false);

            fetchPatients(currentPage, pageSize, searchTerm);
        } catch (error) {
            messageApi.open({
                key: "updating_message",
                type: "error",
                content: "Error occurred while updating the patient!",
                duration: 3
            });
        }
    };

    useEffect(() => {
        if (editFormValues) {
            form.setFieldsValue({
                id: editFormValues.id,
                name: editFormValues.name,
                gender: editFormValues.gender,
                contact_number: editFormValues.contact_number,
                date_of_birth: moment(editFormValues.date_of_birth),
            });
        }
    }, [editFormValues, form]);


    const fetchPatients = async (page: number, pageSize: number, search: string) => {
        try {
            const data = await window.electron.patients.get(page, pageSize, search);
            const transformedData = data.patients.map<PatientTableItems>((patient: Patient) => ({
                key: patient.id!,
                id: patient.id,
                name: patient.name,
                gender: patient.gender,
                contact_number: patient.contact_number,
                date_of_birth: formatISO(patient.date_of_birth, { representation: 'date' }),
            }));
            setDataSource(transformedData);
            setTotal(data.total);
        } catch (error) {
            console.error("Failed to fetch patient data:", error);
        }
    };

    const onSearch = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    useEffect(() => {
        fetchPatients(currentPage, pageSize, searchTerm);
    }, [currentPage, pageSize, searchTerm]);

    const deleteSelectedPatients = async () => {
        setLoading(true);
        const isAdmin = await window.electron.authenticate.isAdmin();
        if (!isAdmin) {
            messageApi.open({
                key: "login_message",
                type: "warning",
                content: "Admin user privileges required!"
            });
            setLoading(false);
            return;
        }
        confirm({
            title: 'Do you want to delete these records?',
            icon: <ExclamationCircleFilled />,
            content: 'This action is irreversible. Do you want to proceed?',
            onOk() {
                const selectedId = Number(selectedRowKeys[0]);
                return window.electron.patients
                    .delete(selectedId)
                    .then(() => {
                        setSelectedRowKeys([]);
                        fetchPatients(currentPage, pageSize, searchTerm);
                    })
                    .catch((error) => {
                        console.error('Error deleting records:', error);
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            },
            onCancel() {
                setLoading(false);
            },
        });
    };
    const loadAddPatientPage = () => {
        navigate('/add-patient');
    }


    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection: TableRowSelection<PatientTableItems> = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const hasSelected = selectedRowKeys.length > 0;

    return (
        <Flex gap="middle" vertical>
            {contextHolder}
            <Flex justify="space-between">
                <div>
                    <Search
                        placeholder="Search patients by name"
                        onSearch={onSearch}
                        enterButton
                        style={{ width: 300 }}
                    />
                </div>
                <div>
                    {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}
                </div>
                <Flex align="center" justify="end" gap="middle">
                    <Button type="primary" size='middle' onClick={loadAddPatientPage}>
                        Add
                    </Button>
                    <Button
                        variant='outlined'
                        type="default"
                        size='middle'
                        color='danger'
                        onClick={deleteSelectedPatients}
                        disabled={!hasSelected}
                        loading={loading}
                    >
                        Delete
                    </Button>
                </Flex>
            </Flex>
            <Table<PatientTableItems>
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
            />

            <div>
                {editFormValues && (
                    <Modal
                        open={open}
                        title="Edit Patient"
                        okText="Update"
                        cancelText="Cancel"
                        onCancel={() => setOpen(false)}
                        onOk={() => form.submit()}
                        destroyOnClose
                    >
                        <Form<Patient>
                            layout="vertical"
                            form={form}
                            onFinish={onEditSubmit}
                        >
                            <Form.Item name="id" label="ID">
                                <Input disabled />
                            </Form.Item>
                            <Form.Item
                                name="name"
                                label="Name"
                                rules={[{ required: true, message: 'Please enter the name' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item name="gender" label="Gender">
                                <Select>
                                    <Select.Option value="Male">Male</Select.Option>
                                    <Select.Option value="Female">Female</Select.Option>
                                    <Select.Option value="Other">Other</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="date_of_birth"
                                label="Date of Birth"
                                rules={[{ required: true, message: 'Please select the date of birth' }]}
                            >
                                <DatePicker />
                            </Form.Item>
                            <Form.Item
                                name="contact_number"
                                label="Contact Number"
                                rules={[{ required: true, message: 'Please enter the contact number' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Form>
                    </Modal>
                )}

            </div>
        </Flex>
    );
};

export default PatientsTable;