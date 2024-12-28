import { Card } from "antd";
import DoctorTable from "../../components/tables/DoctorTable";


const Doctors = () => {
    return (
        <div>
            <Card title="Welcome to the Doctors Page">
                <div>
                    <DoctorTable/>
                </div>
            </Card>
        </div>
    );
};

export default Doctors;



