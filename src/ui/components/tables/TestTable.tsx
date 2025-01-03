import { useEffect, useState } from 'react';
import { Button, Flex, Form, Input, message, Modal, Table } from 'antd';
import type { TableColumnsType } from 'antd';
import Search from 'antd/es/input/Search';

interface TestTableItems extends Test {
    key: number;
}

const TestTable = () => {
    const [messageApi, contextHolder] = message.useMessage();

    const [dataSource, setDataSource] = useState<TestTableItems[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);

    const [form] = Form.useForm();
    const [editFormValues, setEditFormValues] = useState<Test>();
    const [open, setOpen] = useState(false);


    const onTableRowEditClick = (record: TestTableItems) => {
        const test: Test = {
            id: record.id,
            name: record.name,
            code: record.code,
            price: record.price
        }
        setEditFormValues(test);
        setOpen(true);
    }

    const columns: TableColumnsType<TestTableItems> = [
        { title: 'ID', dataIndex: 'id' },
        { title: 'Name', dataIndex: 'name' },
        { title: 'Code', dataIndex: 'code' },
        { title: 'Price', dataIndex: 'price' },
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
                    Update price
                </Button>
            ),
        },
    ];

    const onEditSubmit = async (values: Test) => {
        try {
            messageApi.open({
                key: "updating_message",
                type: "loading",
                content: "Updating test price..."
            });

            const res = await window.electron.tests.updatePrice(values.id, values.price);

            if (res.success) {
                messageApi.open({
                    key: "updating_message",
                    type: "success",
                    content: "Test price updated!",
                    duration: 2
                });
            } else {
                messageApi.open({
                    key: "updating_message",
                    type: "error",
                    content: "Error occurred while updating the test price!",
                    duration: 3
                });
            }

            setOpen(false);

            fetchTests(currentPage, pageSize, searchTerm);
        } catch (error) {
            messageApi.open({
                key: "updating_message",
                type: "error",
                content: "Error occurred while updating the test price!",
                duration: 3
            });
        }
    };

    useEffect(() => {
        if (editFormValues) {
            form.setFieldsValue({
                id: editFormValues.id,
                name: editFormValues.name,
                code: editFormValues.code,
                price: editFormValues.price,
            });
        }
    }, [editFormValues, form]);


    const fetchTests = async (page: number, pageSize: number, search: string) => {
        try {
            const data = await window.electron.tests.get(page, pageSize, search);
            console.log(`Total: ${data.total}`);
            
            const transformedData = data.tests.map<TestTableItems>((test: Test) => ({
                key: test.id!,
                id: test.id,
                name: test.name,
                code: test.code,
                price: test.price,
            }));
            setDataSource(transformedData);
            setTotal(data.total);
        } catch (error) {
            console.error("Failed to fetch test data:", error);
        }
    };

    const onSearch = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    useEffect(() => {
        fetchTests(currentPage, pageSize, searchTerm);
    }, [currentPage, pageSize, searchTerm]);

    return (
        <Flex gap="middle" vertical>
            {contextHolder}
            <Flex justify="space-between">
                <div>
                    <Search
                        placeholder="Search tests by name"
                        onSearch={onSearch}
                        enterButton
                        style={{ width: 300 }}
                    />
                </div>
            </Flex>
            <Table<TestTableItems>
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
                        title="Edit test price"
                        okText="Update"
                        cancelText="Cancel"
                        onCancel={() => setOpen(false)}
                        onOk={() => form.submit()}
                        destroyOnClose
                    >
                        <Form<Test>
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
                            >
                                <Input disabled />
                            </Form.Item>
                            <Form.Item name="code" label="Code">
                                <Input disabled />
                            </Form.Item>
                            <Form.Item
                                name="price"
                                label="Price"
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

export default TestTable;