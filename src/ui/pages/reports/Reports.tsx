import { Card } from "antd"
import PrintReportTable from "../../components/tables/PrintReportTable";

const Reports = () => {

    return (
        <div>
            <Card
                title="Print Reports"
            >
                <div>
                    <PrintReportTable />
                </div>
            </Card>
        </div>
    )
}

export default Reports;