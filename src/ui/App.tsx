import { useState } from 'react'
import './App.css'

import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

import { Button, Layout, theme } from 'antd'
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import Logo from './components/Logo';
import Sidebar from './components/Sidebar';
import ToggleThemeButton from './components/ToggleThemeButton';
import Home from './pages/home/Home';
import Patients from './pages/patients/Patients';
import AddPatient from './pages/patients/AddPatient';
import Tests from './pages/settings/Tests';
import Doctors from './pages/doctors/Doctors';
import NormalRanges from './pages/settings/NormalRanges';
import { ScrollArea } from './components/ScrollArea';
import RegisteredTests from './pages/test-registraion/RegisteredTests';
import NewTest from './pages/test-registraion/NewTest';
import EditTestRegistration from './pages/test-registraion/EditTestRegistration';
import PageSettings from './pages/settings/PageSettings';
import Reports from './pages/reports/Reports';
import PatientAnalysis from './pages/analysis/PatientAnalysis';
import TestAnalysis from './pages/analysis/TestAnalysis';

const { Header, Sider, Content } = Layout;

function App() {
    const [darkTheme, setDarkTheme] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    const [editTestRegistrationId, setEditTestRegistrationId] = useState<number>(-1);

    const toggleTheme = () => {
        setDarkTheme(!darkTheme);
    }
    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    }

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const setIdToEditTestRegistration = (id: number) => {
        setEditTestRegistrationId(id);
    }

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
                    <ScrollArea>
                        <Content className='m-5' style={{ height: "calc(98vh - 100px)" }} >
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/test-registration" element={<RegisteredTests editTestFunctionHandle={setIdToEditTestRegistration}/>} />
                                <Route path="/edit-test-registration" element={<EditTestRegistration testRegistrationId={editTestRegistrationId} />} />
                                <Route path="/new-test" element={<NewTest />} />
                                <Route path="/patients" element={<Patients />} />
                                <Route path="/doctors" element={<Doctors />} />
                                <Route path="/add-patient" element={<AddPatient />} />
                                <Route path="/settings/tests" element={<Tests />} />
                                <Route path="/settings/normal-ranges" element={<NormalRanges />} />
                                <Route path="/settings/page" element={<PageSettings />} />                                
                                <Route path="/reports" element={<Reports />} />                                
                                <Route path="/analysis/patient-analysis" element={<PatientAnalysis />} />                                
                                <Route path="/analysis/test-analysis" element={<TestAnalysis />} />                                
                            </Routes>
                        </Content>
                    </ScrollArea>
                </Layout>
            </Layout>
        </Router>
    )
}

export default App
