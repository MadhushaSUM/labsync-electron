import { useNavigate } from "react-router-dom";
import { Menu } from "antd";
import {
    PieChartOutlined,
    HomeOutlined,
    SettingOutlined,
    PlusCircleOutlined,
    PrinterOutlined,
    FileTextOutlined,
    UsergroupAddOutlined
} from '@ant-design/icons';

type SidebarProps = {
    darkTheme: boolean;
}

const Sidebar = ({ darkTheme }: SidebarProps) => {
    const navigate = useNavigate();

    return (
        <Menu
            theme={darkTheme ? 'dark' : 'light'}
            mode="inline"
            className="menu-bar"
            onClick={({ key }) => navigate(key)}
        >
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