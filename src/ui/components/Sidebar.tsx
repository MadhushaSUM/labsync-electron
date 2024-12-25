import React from "react";
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
            <Menu.Item key="/new-test" icon={<PlusCircleOutlined />}>
                New test
            </Menu.Item>
            <Menu.Item key="/reports" icon={<PrinterOutlined />}>
                Reports
            </Menu.Item>
            <Menu.Item key="/receipts" icon={<FileTextOutlined />}>
                Receipts
            </Menu.Item>
            <Menu.SubMenu key="analysis" title="Analysis" icon={<PieChartOutlined />}>
                <Menu.Item key="/analysis/patient-analysis">Patient analysis</Menu.Item>
                <Menu.Item key="/analysis/test-analysis">Test analysis</Menu.Item>
                <Menu.Item key="/analysis/finantial-analysis">Finantial analysis</Menu.Item>
            </Menu.SubMenu>
            <Menu.Item key="/patients-n-doctors" icon={<UsergroupAddOutlined />}>
                Patients and doctors
            </Menu.Item>
            <Menu.SubMenu key="/settings" title="Settings" icon={<SettingOutlined />}>
                <Menu.Item key="/settings/general">General</Menu.Item>
                <Menu.Item key="/settings/page">Page</Menu.Item>
                <Menu.Item key="/settings/user">User</Menu.Item>
            </Menu.SubMenu>
        </Menu>
    )
}

export default Sidebar;