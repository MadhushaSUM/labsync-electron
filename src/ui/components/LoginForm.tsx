import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Modal } from 'antd';

const LoginForm = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const onFinish = async (values: any) => {
        try {
            messageApi.open({
                key: "login_message",
                type: "loading",
                content: "Authenticating..."
            });
            const res = await window.electron.authenticate.login(values.username, values.password);
            if (res.success) {                
                Modal.destroyAll();
            } else {
                messageApi.open({
                    key: "login_message",
                    type: "error",
                    content: res.error
                });
            }
        } catch (error: any) {
            messageApi.open({
                key: "login_message",
                type: "error",
                content: error.toString()
            });
        }
    };

    return (
        <Form
            name="login"
            initialValues={{ remember: true }}
            style={{ maxWidth: 360 }}
            onFinish={onFinish}
        >
            <Form.Item
                name="username"
                label="Username"
                rules={[{ required: true, message: 'Please input your Username!' }]}
            >
                <Input prefix={<UserOutlined />} placeholder="Username" />
            </Form.Item>
            <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: 'Please input your Password!' }]}
            >
                <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
            </Form.Item>

            <Form.Item>
                <Button
                    block
                    type="primary"
                    htmlType="submit"
                >
                    Log in
                </Button>
            </Form.Item>
            {contextHolder}
        </Form>
    );
};

export default LoginForm;