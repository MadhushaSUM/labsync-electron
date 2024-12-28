import { useState } from 'react'
import './App.css'

import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

import { Button, Layout, theme } from 'antd'
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import Logo from './components/Logo';
import Sidebar from './components/Sidebar';
import ToggleThemeButton from './components/ToggleThemeButton';
import Home from './pages/Home';
import NewTest from './pages/NewTest';
import Patients from './pages/patients/Patients';
import AddPatient from './pages/patients/AddPatient';
import Tests from './pages/settings/Tests';
import Doctors from './pages/doctors/Doctors';
import NormalRanges from './pages/settings/NormalRanges';

const { Header, Sider, Content } = Layout;

function App() {
    const [darkTheme, setDarkTheme] = useState(true);
    const [collapsed, setCollapsed] = useState(true);
    const toggleTheme = () => {
        setDarkTheme(!darkTheme);
    }
    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    }

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <Router>
            <Layout>
                <Sider
                    theme={darkTheme ? 'dark' : 'light'}
                    className='sidebar'
                    collapsible
                    collapsed={collapsed}
                    trigger={null}
                >
                    <Logo />
                    <Sidebar darkTheme={darkTheme} />
                    <ToggleThemeButton darkTheme={darkTheme} toggleTheme={toggleTheme} />
                </Sider>
                <Layout>
                    <Header style={{ padding: 0, background: colorBgContainer }}>
                        <Button
                            className='toggle'
                            type='text'
                            onClick={toggleCollapse}
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        />
                    </Header>
                    <Content className='m-5'>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/new-test" element={<NewTest />} />
                            <Route path="/patients" element={<Patients />} />
                            <Route path="/doctors" element={<Doctors />} />
                            <Route path="/add-patient" element={<AddPatient />} />
                            <Route path="/settings/tests" element={<Tests />} />
                            <Route path="/settings/normal-ranges" element={<NormalRanges />} />
                        </Routes>
                    </Content>
                </Layout>
            </Layout>
        </Router>
    )
}

export default App
