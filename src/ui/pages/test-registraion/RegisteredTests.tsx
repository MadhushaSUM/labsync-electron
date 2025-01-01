import { Button, Card, Flex } from "antd"
import { useNavigate } from "react-router-dom";
import TestRegistrationTable from "../../components/tables/TestRegistrationTable";

const RegisteredTests = ({ editTestFunctionHandle }: { editTestFunctionHandle: (id: number) => void }) => {
    const navigate = useNavigate();

    return (
        <div>
            <Card
                title="Registered Tests"
            >
                <div>
                    <Flex justify="end" gap={5}>
                        <Button variant="solid" color="primary" onClick={() => navigate("/new-test")}>New Test Registration</Button>
                        <Button variant="outlined" color="danger">Delete</Button>
                    </Flex>

                    <TestRegistrationTable editTestFunctionHandle={editTestFunctionHandle} />
                </div>
            </Card>
        </div>
    )
}

export default RegisteredTests;