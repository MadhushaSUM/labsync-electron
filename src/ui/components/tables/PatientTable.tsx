import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Button, Flex, Table } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import Search from 'antd/es/input/Search';

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

type PatientTableItems = Omit<Patient, "date_of_birth"> & {
    key: number;
    date_of_birth: string;
}

const columns: TableColumnsType<PatientTableItems> = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'Name', dataIndex: 'name' },
    { title: 'Gender', dataIndex: 'gender' },
    { title: 'Date of birth', dataIndex: 'date_of_birth' },
    { title: 'Contact number', dataIndex: 'contact_number' },
];

const PatientsTable = () => {
    const navigate = useNavigate();

    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState<PatientTableItems[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);


    // Fetch data on component mount and when search term, page, or pageSize changes
    const fetchPatients = async (page: number, pageSize: number, search: string) => {
        try {
            const data = await window.electron.patients.get(page, pageSize, search);
            console.log(data);            
            const transformedData = data.patients.map<PatientTableItems>((patient: Patient) => ({
                key: patient.id!,
                id: patient.id,
                name: patient.name,
                gender: patient.gender,
                contact_number: patient.contact_number,
                date_of_birth: patient.date_of_birth.toLocaleDateString(),
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


    const deleteSelectedPatients = () => {
        setLoading(true);
        // ajax request after empty completing
        setTimeout(() => {
            setSelectedRowKeys([]);
            setLoading(false);
        }, 1000);
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
                        type="default"
                        size='middle'
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
        </Flex>
    );
};

export default PatientsTable;