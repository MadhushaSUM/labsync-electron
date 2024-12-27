import { Card } from "antd";
import PatientsTable from "../../components/tables/PatientTable";


const Patients = () => {
    return (
        <div>
            <Card title="Welcome to the Patients Page">
                <div>
                    <PatientsTable/>
                </div>
            </Card>
        </div>
    );
};

export default Patients;



