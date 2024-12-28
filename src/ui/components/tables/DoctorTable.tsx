import React, { useEffect, useState } from 'react';
import { Button, Flex, Form, Input, message, Modal, Table } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import Search from 'antd/es/input/Search';

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

interface DoctorTableItems extends Doctor {
    key: number;
}

const DoctorsTable = () => {
    const [messageApi, contextHolder] = message.useMessage();

    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState<DoctorTableItems[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);


    const [form] = Form.useForm();
    const [addForm] = Form.useForm();
    const [editFormValues, setEditFormValues] = useState<Doctor>();
    const [open, setOpen] = useState(false);

    const [openAdd, setOpenAdd] = useState(false);


    const onTableRowEditClick = (record: DoctorTableItems) => {
        const doctor: Doctor = {
            id: record.id,
            name: record.name
        }
        setEditFormValues(doctor);
        setOpen(true);
    }

    const columns: TableColumnsType<DoctorTableItems> = [
        { title: 'ID', dataIndex: 'id' },
        { title: 'Name', dataIndex: 'name' },
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

    const onEditSubmit = async (values: Doctor) => {
        try {
            messageApi.open({
                key: "updating_message",
                type: "loading",
                content: "Updating doctor..."
            });

            const updatingDoctor: Doctor = {
                id: values.id,
                name: values.name
            }

            const res = await window.electron.doctors.update(values.id, updatingDoctor);

            if (res.success) {
                messageApi.open({
                    key: "updating_message",
                    type: "success",
                    content: "Doctor updated!",
                    duration: 2
                });
            } else {
                messageApi.open({
                    key: "updating_message",
                    type: "error",
                    content: "Error occured while updating the doctor!",
                    duration: 3
                });
            }

            setOpen(false);

            fetchDoctors(currentPage, pageSize, searchTerm);
        } catch (error) {
            messageApi.open({
                key: "updating_message",
                type: "error",
                content: "Error occured while updating the doctor!",
                duration: 3
            });
        }
    };

    const onAddSubmit = async (values: Doctor) => {
        try {
            messageApi.open({
                key: "adding_message",
                type: "loading",
                content: "Adding doctor..."
            });

            const newDoctor: Omit<Doctor, "id"> = {
                name: values.name
            }

            const res = await window.electron.doctors.insert(newDoctor);

            if (res.success) {
                messageApi.open({
                    key: "adding_message",
                    type: "success",
                    content: "Doctor added!",
                    duration: 2
                });
            } else {
                messageApi.open({
                    key: "adding_message",
                    type: "error",
                    content: "Error occured while adding the doctor!",
                    duration: 3
                });
            }

            addForm.resetFields();

            setOpenAdd(false);

            fetchDoctors(currentPage, pageSize, searchTerm);
        } catch (error) {
            messageApi.open({
                key: "adding_message",
                type: "error",
                content: "Error occured while adding the doctor!",
                duration: 3
            });
        }
    };

    useEffect(() => {
        if (editFormValues) {
            form.setFieldsValue({
                id: editFormValues.id,
                name: editFormValues.name
            });
        }
    }, [editFormValues, form]);


    const fetchDoctors = async (page: number, pageSize: number, search: string) => {
        try {
            const data = await window.electron.doctors.get(page, pageSize, search);
            const transformedData = data.doctors.map<DoctorTableItems>((doctor: Doctor) => ({
                key: doctor.id!,
                id: doctor.id,
                name: doctor.name
            }));
            setDataSource(transformedData);
            setTotal(data.total);
        } catch (error) {
            console.error("Failed to fetch doctor data:", error);
        }
    };

    const onSearch = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    useEffect(() => {
        fetchDoctors(currentPage, pageSize, searchTerm);
    }, [currentPage, pageSize, searchTerm]);


    const deleteSelectedDoctors = () => {
        setLoading(true);
        // ajax request after empty completing
        setTimeout(() => {
            setSelectedRowKeys([]);
            setLoading(false);
        }, 1000);
    };

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection: TableRowSelection<DoctorTableItems> = {
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
                        placeholder="Search doctor by name"
                        onSearch={onSearch}
                        enterButton
                        style={{ width: 300 }}
                    />
                </div>
                <div>
                    {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}
                </div>
                <Flex align="center" justify="end" gap="middle">
                    <Button type="primary" size='middle' onClick={() => setOpenAdd(true)}>
                        Add
                    </Button>
                    <Button
                        variant='outlined'
                        type="default"
                        size='middle'
                        color='danger'
                        onClick={deleteSelectedDoctors}
                        disabled={!hasSelected}
                        loading={loading}
                    >
                        Delete
                    </Button>
                </Flex>
            </Flex>
            <Table<DoctorTableItems>
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
                        title="Edit doctor"
                        okText="Update"
                        cancelText="Cancel"
                        onCancel={() => setOpen(false)}
                        onOk={() => form.submit()}
                        destroyOnClose
                    >
                        <Form<Doctor>
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
                        </Form>
                    </Modal>
                )}
            </div>
            <div>
                <Modal
                    open={openAdd}
                    title="Add doctor"
                    okText="Add"
                    cancelText="Cancel"
                    onCancel={() => setOpenAdd(false)}
                    onOk={() => addForm.submit()}
                    destroyOnClose
                >
                    <Form<Doctor>
                        layout="vertical"
                        form={addForm}
                        onFinish={onAddSubmit}
                    >
                        <Form.Item
                            name="name"
                            label="Name"
                            rules={[{ required: true, message: 'Please enter the name' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </Flex>
    );
};

export default DoctorsTable;