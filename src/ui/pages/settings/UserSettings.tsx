import { Card } from "antd";
import UserTable from "../../components/tables/UserTable";


const UserSettings = () => {
    return (
        <Card
            title="User Settings"
        >
            <div>
                <UserTable />
            </div>
        </Card>
    )
}

export default UserSettings;