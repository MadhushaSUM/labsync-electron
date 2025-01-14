import { useEffect, useState } from 'react';
import { Button, Flex, Form, Input, message, Modal, Select, Table } from 'antd';
import type { TableColumnsType } from 'antd';

interface UserTableItems extends User {
    key: number;
}

const UserTable = () => {
    const [messageApi, contextHolder] = message.useMessage();

    const [dataSource, setDataSource] = useState<UserTableItems[]>([]);

    const [form] = Form.useForm();
    const [editFormValues, setEditFormValues] = useState<User>();
    const [open, setOpen] = useState(false);

    const [openChangePw, setOpenChangePw] = useState(false);


    const onTableRowEditClick = (record: UserTableItems) => {
        const user: User = {
            id: record.id,
            username: record.username,
            role: record.role,
        }
        setEditFormValues(user);
        setOpen(true);
    }

    const onUpdatePasswordClick = (record: UserTableItems) => {
        const user: User = {
            id: record.id,
            username: record.username,
            role: record.role,
        }
        setEditFormValues(user);
        setOpenChangePw(true);
    }

    const columns: TableColumnsType<UserTableItems> = [
        { title: 'ID', dataIndex: 'id' },
        { title: 'Username', dataIndex: 'username' },
        { title: 'Role', dataIndex: 'role' },
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
                        onClick={() => onTableRowEditClick(record)}
                        disabled={record.id == 1}
                    >
                        Edit user
                    </Button>
                    <Button
                        size='small'
                        variant='outlined'
                        color='default'
                        onClick={() => onUpdatePasswordClick(record)}
                    >
                        Update password
                    </Button>
                </Flex>
            ),
        },
    ];

    const onEditSubmit = async (values: User) => {
        try {
            messageApi.open({
                key: "updating_message",
                type: "loading",
                content: "Updating user..."
            });

            const res = await window.electron.authenticate.updateUser(values.id, values.username, values.role);

            if (res.success) {
                messageApi.open({
                    key: "updating_message",
                    type: "success",
                    content: "User updated!",
                    duration: 2
                });
            } else {
                messageApi.open({
                    key: "updating_message",
                    type: "error",
                    content: "Error occurred while updating the user!",
                    duration: 3
                });
            }

            setOpen(false);

            fetchUsers();
        } catch (error) {
            messageApi.open({
                key: "updating_message",
                type: "error",
                content: "Error occurred while updating the user!",
                duration: 3
            });
        }
    };

    const onPasswordChangeSubmit = async (values: any) => {
        try {
            messageApi.open({
                key: "updating_message",
                type: "loading",
                content: "Updating password..."
            });

            const res = await window.electron.authenticate.updatePassword(values.id, values.currentPassword, values.newPassword);

            if (res.success) {
                messageApi.open({
                    key: "updating_message",
                    type: "success",
                    content: "Password updated!",
                    duration: 2
                });
            } else {
                messageApi.open({
                    key: "updating_message",
                    type: "error",
                    content: res.error,
                    duration: 3
                });
            }

            setOpenChangePw(false);
        } catch (error: any) {
            messageApi.open({
                key: "updating_message",
                type: "error",
                content: error.message,
                duration: 3
            });
        }
    };

    useEffect(() => {
        if (editFormValues) {
            form.setFieldsValue({
                id: editFormValues.id,
                username: editFormValues.username,
                role: editFormValues.role,
            });
        }
    }, [editFormValues, form]);


    const fetchUsers = async () => {
        try {
            const data = await window.electron.authenticate.getUsers();
            const transformedData = data.users.map<UserTableItems>((user: User) => ({
                key: user.id,
                id: user.id,
                username: user.username,
                role: user.role,
            }));
            setDataSource(transformedData);
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <Flex gap="middle" vertical>
            {contextHolder}
            <Table<UserTableItems>
                columns={columns}
                dataSource={dataSource}
            />

            <div>
                {editFormValues && (
                    <Modal
                        open={open}
                        title="Edit user"
                        okText="Update"
                        cancelText="Cancel"
                        onCancel={() => setOpen(false)}
                        onOk={() => form.submit()}
                        destroyOnClose
                    >
                        <Form<User>
                            layout="vertical"
                            form={form}
                            onFinish={onEditSubmit}
                        >
                            <Form.Item name="id" label="ID">
                                <Input disabled />
                            </Form.Item>
                            <Form.Item
                                name="username"
                                label="Username"
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item name="role" label="Role">
                                <Select>
                                    <Select.Option value="admin">Admin</Select.Option>
                                    <Select.Option value="user">User</Select.Option>
                                </Select>
                            </Form.Item>
                        </Form>
                    </Modal>
                )}
                {editFormValues && (
                    <Modal
                        open={openChangePw}
                        title="Update user password"
                        okText="Update"
                        cancelText="Cancel"
                        onCancel={() => setOpenChangePw(false)}
                        onOk={() => form.submit()}
                        destroyOnClose
                    >
                        <Form<User>
                            layout="vertical"
                            form={form}
                            onFinish={onPasswordChangeSubmit}
                        >
                            <Form.Item name="id" label="ID">
                                <Input disabled />
                            </Form.Item>
                            <Form.Item
                                name="currentPassword"
                                label="Current Password"
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item
                                name="newPassword"
                                label="New Password"
                            >
                                <Input.Password />
                            </Form.Item>
                        </Form>
                    </Modal>
                )}
            </div>
        </Flex>
    );
};

export default UserTable;