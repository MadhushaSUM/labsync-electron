import { Card } from "antd"
import TestRegistrationTable from "../../components/tables/TestRegistrationTable";

const RegisteredTests = ({ editTestFunctionHandle }: { editTestFunctionHandle: (id: number) => void }) => {
    return (
        <div>
            <Card
                title="Registered Tests"
            >
                <div>
                    <TestRegistrationTable
                        editTestFunctionHandle={editTestFunctionHandle}
                    />
                </div>
            </Card>
        </div>
    )
}

export default RegisteredTests;