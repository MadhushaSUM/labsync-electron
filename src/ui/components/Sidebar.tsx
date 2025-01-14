import { useNavigate } from "react-router-dom";
import { Menu, message } from "antd";
import {
    PieChartOutlined,
    HomeOutlined,
    SettingOutlined,
    PlusCircleOutlined,
    PrinterOutlined,
    UsergroupAddOutlined
} from '@ant-design/icons';

type SidebarProps = {
    darkTheme: boolean;
}

const restrictedRoutes = new Set(["/analysis/finantial-analysis", "/settings", "/settings/general", "/settings/tests", "/settings/normal-ranges", "/settings/users"]);

const Sidebar = ({ darkTheme }: SidebarProps) => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();


    const onClick = async (key: string) => {
        try {
            const isAdmin = await window.electron.authenticate.isAdmin();
            if (restrictedRoutes.has(key) && !isAdmin) {
                messageApi.open({
                    key: "login_message",
                    type: "warning",
                    content: "Admin user privileges required!"
                });
                return;
            }

            navigate(key);
        } catch (error: any) {
            messageApi.open({
                key: "login_message",
                type: "error",
                content: error.message
            });
        }
    }

    return (
        <Menu
            theme={darkTheme ? 'dark' : 'light'}
            mode="inline"
            className="menu-bar"
            onClick={({ key }) => onClick(key)}
        >
            {contextHolder}
            <Menu.Item key="/" icon={<HomeOutlined />}>
                Home
            </Menu.Item>
            <Menu.Item key="/test-registration" icon={<PlusCircleOutlined />}>
                Test Registration
            </Menu.Item>
            <Menu.Item key="/reports" icon={<PrinterOutlined />}>
                Reports
            </Menu.Item>
            <Menu.SubMenu key="analysis" title="Analysis" icon={<PieChartOutlined />}>
                <Menu.Item key="/analysis/patient-analysis">Patient analysis</Menu.Item>
                <Menu.Item key="/analysis/test-analysis">Test analysis</Menu.Item>
                <Menu.Item key="/analysis/finantial-analysis">Finantial analysis</Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu key="patients-n-doctors" title="P n D" icon={<UsergroupAddOutlined />}>
                <Menu.Item key="/patients">Patients</Menu.Item>
                <Menu.Item key="/doctors">Doctors</Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu key="/settings" title="Settings" icon={<SettingOutlined />}>
                <Menu.Item key="/settings/general">General</Menu.Item>
                <Menu.Item key="/settings/tests">Tests</Menu.Item>
                <Menu.Item key="/settings/normal-ranges">Normal ranges</Menu.Item>
                <Menu.Item key="/settings/users">Users</Menu.Item>
            </Menu.SubMenu>
        </Menu>
    )
}

export default Sidebar;