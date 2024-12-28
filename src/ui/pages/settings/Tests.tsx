import { Card } from "antd";
import TestTable from "../../components/tables/TestTable";

const Tests = () => {
    return (
        <div>
            <Card title="Welcome to the Settings:Tests Page">
                <div>
                    <TestTable/>
                </div>
            </Card>
        </div>
    );
};

export default Tests;
